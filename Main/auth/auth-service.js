/**
 * CampusConnect Shared Authentication Service
 * Open Student Project Mode — Passwordless & Privacy-Preserving
 */
(function() {
    let authStateListeners = [];
    let currentUser = null;

    // Purge any legacy mock credentials from earlier development sessions
    try {
        localStorage.removeItem("campusConnect_mock_uid");
        localStorage.removeItem("campusConnect_mock_email");
    } catch (e) {}

    function getApiBase() {
        return window.CAMPUS_CONNECT_API_BASE || "https://campus-connect-1-0q94.onrender.com";
    }

    function getLostFoundApiBase() {
        return window.CAMPUS_CONNECT_LF_API_BASE || "https://campus-connect-4n2t.onrender.com";
    }

    function notifyListeners(user) {
        authStateListeners.forEach(function(listener) {
            try {
                listener(user);
            } catch (e) {
                console.error("Auth listener error:", e);
            }
        });
    }

    const CampusAuth = {
        init: function() {
            // Check if real Firebase instance was already initialized externally
            if (typeof window.firebase !== "undefined" && window.firebase.apps && window.firebase.apps.length > 0) {
                try {
                    const auth = window.firebase.auth();
                    auth.onAuthStateChanged(function(user) {
                        currentUser = user;
                        notifyListeners(user);
                    });
                    return;
                } catch (err) {
                    console.warn("[CampusAuth] External auth check notice:", err.message);
                }
            }
            currentUser = null;
            setTimeout(function() {
                notifyListeners(null);
            }, 50);
        },

        getCurrentUser: function() {
            return currentUser;
        },

        isLoggedIn: function() {
            return Boolean(currentUser);
        },

        onAuthStateChanged: function(callback) {
            authStateListeners.push(callback);
            callback(currentUser);
            return function() {
                authStateListeners = authStateListeners.filter(function(cb) { return cb !== callback; });
            };
        },

        getIdToken: async function() {
            if (!currentUser) return null;
            if (typeof currentUser.getIdToken === "function") {
                return await currentUser.getIdToken();
            }
            return null;
        },

        signIn: async function() {
            // Passwords are never collected or accepted
            return {
                success: false,
                error: "Sign-in is currently disabled in open campus student mode. All features are accessible as guest."
            };
        },

        signUp: async function() {
            // Passwords are never collected or accepted
            return {
                success: false,
                error: "Account creation is disabled to protect student privacy. All features are accessible as guest."
            };
        },

        sendPasswordReset: async function() {
            return Promise.resolve();
        },

        signOut: async function() {
            if (typeof window.firebase !== "undefined" && window.firebase.apps && window.firebase.apps.length > 0) {
                try {
                    await window.firebase.auth().signOut();
                } catch (e) {}
            }
            currentUser = null;
            try {
                localStorage.removeItem("campusConnect_uid");
                localStorage.removeItem("campusConnect_email");
                localStorage.removeItem("campus_user_token");
                localStorage.removeItem("firebase_token");
            } catch (e) {}
            notifyListeners(null);
            return { success: true };
        },

        syncGuestFavourites: async function() {
            if (!currentUser) return { synced: 0 };
            const visitorId = localStorage.getItem("campusBites_visitorId") || localStorage.getItem("visitorId") || "";
            if (!visitorId) return { synced: 0 };

            const token = await this.getIdToken();
            if (!token) return { synced: 0 };

            try {
                const res = await fetch(`${getApiBase()}/api/favourites/sync`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ visitorId: visitorId })
                });
                if (res.ok) {
                    return await res.json();
                }
            } catch (e) {
                console.warn("[CampusAuth] Favourites sync notice:", e.message);
            }
            return { synced: 0 };
        },

        fetchProfile: async function() {
            const token = await this.getIdToken();
            if (!token) return null;

            const res = await fetch(`${getApiBase()}/api/auth/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Could not load profile");
            return await res.json();
        },

        updateProfile: async function(profileData) {
            const token = await this.getIdToken();
            if (!token) throw new Error("Authentication required");

            const res = await fetch(`${getApiBase()}/api/auth/profile`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(profileData)
            });
            if (!res.ok) throw new Error("Could not update profile");
            return await res.json();
        },

        fetchMyOrders: async function() {
            const token = await this.getIdToken();
            if (!token) return { orders: [] };

            const res = await fetch(`${getApiBase()}/api/orders/my-orders`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Could not load orders");
            return await res.json();
        },

        fetchMyReports: async function() {
            const token = await this.getIdToken();
            if (!token) return { lost: [], found: [] };

            const res = await fetch(`${getLostFoundApiBase()}/my-reports`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Could not load your reports");
            return await res.json();
        },

        deleteReport: async function(id, type) {
            const token = await this.getIdToken();
            if (!token) throw new Error("Authentication required");

            const res = await fetch(`${getLostFoundApiBase()}/item/${id}?type=${encodeURIComponent(type || "")}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Could not delete report");
            }
            return data;
        },

        deleteAccount: async function() {
            const token = await this.getIdToken();
            if (!token) throw new Error("Authentication required");

            const res = await fetch(`${getApiBase()}/api/auth/delete-account`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Could not delete account data");
            await this.signOut();
            return { success: true };
        }
    };

    window.CampusAuth = CampusAuth;
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() { CampusAuth.init(); });
    } else {
        CampusAuth.init();
    }
})();
