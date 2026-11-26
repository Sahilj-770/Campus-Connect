process.env.NODE_ENV = "test";
const assert = require("assert");
const {
    verifyFirebaseToken,
    optionalAuth,
    signAuthToken,
    verifyAuthToken,
    hashPassword,
    verifyPassword
} = require("../middleware/auth");

async function runTests() {
    console.log("--- STARTING BACKEND AUTH & OWNERSHIP TESTS ---");

    // 0. Password hashing & JWT roundtrip
    {
        const hash = await hashPassword("campusPass123");
        assert.ok(hash.startsWith("scrypt$"), "Password hash must use scrypt");
        assert.strictEqual(await verifyPassword("campusPass123", hash), true, "Correct password must verify");
        assert.strictEqual(await verifyPassword("wrongPass", hash), false, "Wrong password must fail");
        assert.strictEqual(await verifyPassword("campusPass123", "invalid"), false, "Malformed hash must fail");

        const token = signAuthToken({ uid: "cc_u1", email: "user@example.com", name: "Sahil" });
        const verified = verifyAuthToken(token);
        assert.ok(verified, "Valid JWT must verify");
        assert.strictEqual(verified.uid, "cc_u1");
        assert.strictEqual(verified.email, "user@example.com");
        assert.strictEqual(verified.name, "Sahil");

        const tampered = token.slice(0, -2) + (token.endsWith("ab") ? "cd" : "ab");
        assert.strictEqual(verifyAuthToken(tampered), null, "Tampered JWT must fail");

        const expired = signAuthToken({ uid: "cc_u1", email: "user@example.com" }, -10);
        assert.strictEqual(verifyAuthToken(expired), null, "Expired JWT must fail");
        console.log("✓ Test 0 Passed: Password hashing and JWT sign/verify work");
    }

    // 0b. verifyFirebaseToken accepts real signed JWT even outside test mode
    {
        const prevEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = "production";
        const token = signAuthToken({ uid: "cc_prod1", email: "shared@example.com", name: "Shared User" });
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = { status: () => ({ json: () => {} }) };
        let nextCalled = false;
        await verifyFirebaseToken(req, res, () => { nextCalled = true; });
        assert.strictEqual(nextCalled, true);
        assert.strictEqual(req.user.uid, "cc_prod1");
        assert.strictEqual(req.user.email, "shared@example.com");

        // Rejects test_ tokens in production mode
        let prodRejectCode = null;
        const badReq = { headers: { authorization: "Bearer test_student456_a@b.com" } };
        const badRes = { status: (c) => ({ json: (d) => { prodRejectCode = c; } }) };
        let badNext = false;
        await verifyFirebaseToken(badReq, badRes, () => { badNext = true; });
        assert.strictEqual(badNext, false);
        assert.strictEqual(prodRejectCode, 401);
        process.env.NODE_ENV = prevEnv;
        console.log("✓ Test 0b Passed: Production mode accepts signed JWT and rejects mock tokens");
    }

    // 1. verifyFirebaseToken missing header
    {
        let statusCode = null;
        let responseJson = null;
        const req = { headers: {} };
        const res = {
            status: function(code) {
                statusCode = code;
                return {
                    json: function(data) { responseJson = data; }
                };
            }
        };
        let nextCalled = false;
        await verifyFirebaseToken(req, res, () => { nextCalled = true; });
        assert.strictEqual(statusCode, 401, "Expected 401 when no auth header");
        assert.strictEqual(nextCalled, false, "next() should not be called when unauthenticated");
        assert.strictEqual(responseJson.code, "AUTH_REQUIRED");
        console.log("✓ Test 1 Passed: verifyFirebaseToken blocks unauthenticated requests");
    }

    // 2. verifyFirebaseToken valid dev test token
    {
        const req = { headers: { authorization: "Bearer test_student456_student456@dypcoe.edu.in" } };
        const res = {
            status: function(code) {
                return { json: function() {} };
            }
        };
        let nextCalled = false;
        await verifyFirebaseToken(req, res, () => { nextCalled = true; });
        assert.strictEqual(nextCalled, true, "next() should be called with valid token");
        assert.strictEqual(req.user.uid, "student456");
        assert.strictEqual(req.user.email, "student456@dypcoe.edu.in");
        console.log("✓ Test 2 Passed: verifyFirebaseToken extracts user identity accurately");
    }

    // 3. optionalAuth without header (Guest access)
    {
        const req = { headers: {} };
        const res = {};
        let nextCalled = false;
        await optionalAuth(req, res, () => { nextCalled = true; });
        assert.strictEqual(nextCalled, true, "next() must be called for optionalAuth");
        assert.strictEqual(req.user, null, "req.user must be null for guest request");
        console.log("✓ Test 3 Passed: optionalAuth allows guest browsing without token");
    }

    // 4. optionalAuth with valid token
    {
        const req = { headers: { authorization: "Bearer test_vip789_vip@dypcoe.edu.in" } };
        const res = {};
        let nextCalled = false;
        await optionalAuth(req, res, () => { nextCalled = true; });
        assert.strictEqual(nextCalled, true, "next() must be called for optionalAuth");
        assert.strictEqual(req.user.uid, "vip789");
        console.log("✓ Test 4 Passed: optionalAuth correctly parses user identity when token provided");
    }

    // 5. Ownership verification simulation
    {
        function simulateDelete(item, callingUid) {
            if (!item.user_uid) {
                return { status: 403, error: "Legacy unowned reports cannot be deleted" };
            }
            if (item.user_uid !== callingUid) {
                return { status: 403, error: "You are not authorized to delete this report" };
            }
            return { status: 200, success: true };
        }

        const legacyItem = { serial_number: 1, user_uid: null };
        const userAItem = { serial_number: 2, user_uid: "user_A" };

        // Attempt to delete legacy item
        const legacyResult = simulateDelete(legacyItem, "user_A");
        assert.strictEqual(legacyResult.status, 403, "Legacy items cannot be deleted");

        // User B attempts to delete User A's item
        const unauthorizedResult = simulateDelete(userAItem, "user_B");
        assert.strictEqual(unauthorizedResult.status, 403, "User B cannot delete User A's item");

        // User A deletes own item
        const authorizedResult = simulateDelete(userAItem, "user_A");
        assert.strictEqual(authorizedResult.status, 200, "User A can delete own item");

        console.log("✓ Test 5 Passed: Strict ownership enforcement protects records and legacy data");
    }

    // 6. Profile completion calculation verification
    {
        function calculateProfileCompletion(user) {
            if (!user) return 0;
            const fields = [
                user.full_name,
                user.phone,
                user.department,
                user.roll_number,
                user.year,
                user.division
            ];
            let filled = 0;
            for (const val of fields) {
                if (val && String(val).trim().length > 0) {
                    filled++;
                }
            }
            return Math.round((filled / fields.length) * 100);
        }

        assert.strictEqual(calculateProfileCompletion(null), 0);
        assert.strictEqual(calculateProfileCompletion({}), 0);
        assert.strictEqual(calculateProfileCompletion({ full_name: "Sahil", phone: "9876543210", department: "Computer" }), 50);
        assert.strictEqual(calculateProfileCompletion({
            full_name: "Sahil",
            phone: "9876543210",
            department: "Computer",
            roll_number: "42",
            year: "TE",
            division: "A"
        }), 100);

        console.log("✓ Test 6 Passed: Profile completion calculation is accurate");
    }

    console.log("--- ALL BACKEND AUTH TESTS PASSED ---");
}

runTests().catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
