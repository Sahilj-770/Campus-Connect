const crypto = require("crypto");
const { initializeApp, getApps, cert, applicationDefault } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

let firebaseInitialized = false;
const TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

function getJwtSecret() {
    if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) {
        return process.env.JWT_SECRET.trim();
    }
    // Derive a deterministic fallback from DB_PASSWORD so Render restarts keep existing sessions valid when JWT_SECRET is unset
    const seed = process.env.DB_PASSWORD || "campusconnect-local-dev-secret";
    return crypto.createHash("sha256").update(`cc_jwt_${seed}`).digest("hex");
}

function base64UrlEncode(input) {
    return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input) {
    return Buffer.from(input, "base64url").toString("utf-8");
}

function signAuthToken(user, ttlSeconds = TOKEN_TTL_SECONDS) {
    const now = Math.floor(Date.now() / 1000);
    const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = base64UrlEncode(JSON.stringify({
        uid: user.uid,
        email: user.email || "",
        name: user.name || "",
        iat: now,
        exp: now + ttlSeconds
    }));
    const signature = crypto
        .createHmac("sha256", getJwtSecret())
        .update(`${header}.${payload}`)
        .digest("base64url");
    return `${header}.${payload}.${signature}`;
}

function verifyAuthToken(token) {
    if (typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, sigB64] = parts;
    let header;
    try {
        header = JSON.parse(base64UrlDecode(headerB64));
    } catch {
        return null;
    }
    if (!header || header.alg !== "HS256") return null;

    const expectedSig = crypto
        .createHmac("sha256", getJwtSecret())
        .update(`${headerB64}.${payloadB64}`)
        .digest("base64url");

    const sigBuf = Buffer.from(sigB64);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
        return null;
    }

    let payload;
    try {
        payload = JSON.parse(base64UrlDecode(payloadB64));
    } catch {
        return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (!payload || !payload.uid || (payload.exp && payload.exp < now)) {
        return null;
    }

    return {
        uid: String(payload.uid),
        email: String(payload.email || ""),
        email_verified: true,
        name: String(payload.name || "")
    };
}

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString("hex");
        crypto.scrypt(String(password), salt, 64, (err, derivedKey) => {
            if (err) return reject(err);
            resolve(`scrypt$${salt}$${derivedKey.toString("hex")}`);
        });
    });
}

function verifyPassword(password, storedHash) {
    return new Promise((resolve) => {
        if (!storedHash || typeof storedHash !== "string") return resolve(false);
        const parts = storedHash.split("$");
        if (parts.length !== 3 || parts[0] !== "scrypt") return resolve(false);

        const [, salt, keyHex] = parts;
        crypto.scrypt(String(password), salt, 64, (err, derivedKey) => {
            if (err) return resolve(false);
            const expectedBuf = Buffer.from(keyHex, "hex");
            if (derivedKey.length !== expectedBuf.length) return resolve(false);
            resolve(crypto.timingSafeEqual(derivedKey, expectedBuf));
        });
    });
}

function initFirebase() {
    if (getApps().length > 0) {
        firebaseInitialized = true;
        return;
    }

    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            let serviceAccount;
            try {
                serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            } catch {
                // Handle base64 encoded JSON
                const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf-8");
                serviceAccount = JSON.parse(decoded);
            }
            initializeApp({
                credential: cert(serviceAccount)
            });
            firebaseInitialized = true;
            console.log("[AUTH] Firebase Admin initialized with service account.");
        } else if (
            process.env.FIREBASE_PROJECT_ID &&
            process.env.FIREBASE_CLIENT_EMAIL &&
            process.env.FIREBASE_PRIVATE_KEY
        ) {
            initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
                })
            });
            firebaseInitialized = true;
            console.log("[AUTH] Firebase Admin initialized with environment credentials.");
        } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            initializeApp({
                credential: applicationDefault()
            });
            firebaseInitialized = true;
            console.log("[AUTH] Firebase Admin initialized with applicationDefault.");
        }
    } catch (err) {
        console.error("[AUTH] Error initializing Firebase Admin:", err.message);
    }
}

initFirebase();

function isFirebaseAuthReady() {
    return firebaseInitialized;
}

function tryDevTestToken(token) {
    if (process.env.NODE_ENV !== "test" && process.env.ALLOW_DEV_AUTH !== "true") {
        return null;
    }
    if (token.startsWith("mock_") || token.startsWith("test_")) {
        const parts = token.split("_");
        const uid = parts[1] || "mock-student-uid";
        const email = parts[2] ? decodeURIComponent(parts[2]) : `${uid}@campusconnect.app`;
        return {
            uid,
            email,
            email_verified: true,
            name: "Test Student"
        };
    }
    return null;
}

async function resolveUserFromToken(token) {
    const jwtUser = verifyAuthToken(token);
    if (jwtUser) return jwtUser;

    if (firebaseInitialized) {
        const auth = getAuth();
        const decodedToken = await auth.verifyIdToken(token);
        return {
            uid: decodedToken.uid,
            email: decodedToken.email || "",
            email_verified: Boolean(decodedToken.email_verified),
            name: decodedToken.name || ""
        };
    }

    return tryDevTestToken(token);
}

/**
 * Middleware: Requires a valid CampusConnect JWT (or Firebase ID Token) in the Authorization header.
 * Sets `req.user = { uid, email, email_verified, name }`.
 */
async function verifyFirebaseToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Authentication required",
            code: "AUTH_REQUIRED"
        });
    }

    const token = authHeader.split("Bearer ")[1].trim();

    if (!token) {
        return res.status(401).json({
            error: "Token missing",
            code: "TOKEN_MISSING"
        });
    }

    try {
        const user = await resolveUserFromToken(token);
        if (user) {
            req.user = user;
            return next();
        }
    } catch (error) {
        console.error("[AUTH] Token verification failed:", error.message);
    }

    return res.status(401).json({
        error: "Invalid or expired authentication token",
        code: "TOKEN_INVALID"
    });
}

/**
 * Middleware: Optional authentication.
 * If Authorization header is present and valid, attaches `req.user`.
 * If missing or invalid, `req.user = null` and proceeds without error.
 */
async function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        return next();
    }

    const token = authHeader.split("Bearer ")[1].trim();
    if (!token) {
        req.user = null;
        return next();
    }

    try {
        req.user = await resolveUserFromToken(token);
    } catch {
        req.user = null;
    }

    return next();
}

module.exports = {
    getAuth,
    verifyFirebaseToken,
    optionalAuth,
    isFirebaseAuthReady,
    signAuthToken,
    verifyAuthToken,
    hashPassword,
    verifyPassword
};
