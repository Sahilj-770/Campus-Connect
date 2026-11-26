/**
 * CampusConnect Shared Authentication Service
 * Uses shared backend JWT + MySQL accounts across Web and Android.
 */
(function() {
    const TOKEN_KEY = "campusConnect_token";
    const USER_KEY = "campusConnect_user";

    let authStateListeners = [];
    let currentUser = null;

    // Purge any legacy mock credentials from earlier development sessions
    try {
        localStorage.removeItem("campusConnect_mock_uid");
        localStorage.removeItem("campusConnect_mock_email");
    } catch (e) {}

    function getApiBase() {
        return window.CAMPUS_CONNECT_API_BASE || "https://campus-connect-s85n.onrender.com";
    }

    function getLostFoundApiBase() {
        return window.CAMPUS_CONNECT_LF_API_BASE || "https://campus-connect-s85n.onrender.com/api/lost-found";
    }

    function normalizeUser(rawUser) {
        if (!rawUser) return null;
        const uid = rawUser.firebase_uid || rawUser.uid || "";
        const email = rawUser.email || "";
        const displayName = rawUser.full_name || rawUser.displayName || rawUser.name || (email ? email.split("@")[0] : "Student");
        if (!uid) return null;
        return {
            uid: uid,
            email: email,
            displayName: displayName,
            full_name: rawUser.full_name || displayName,
            phone: rawUser.phone || null,
            department: rawUser.department || null,
            roll_number: rawUser.roll_number || null,
            year: rawUser.year || null,
            division: rawUser.division || null
        };
    }

    function saveSession(token, user) {
        currentUser = normalizeUser(user);
        try {
            if (token && currentUser) {
                localStorage.setItem(TOKEN_KEY, token);
                localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
                localStorage.setItem("studentName", currentUser.displayName);
            } else {
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            }
        } catch (e) {}
    }

    function clearSession() {
        currentUser = null;
        try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem("campusConnect_uid");
            localStorage.removeItem("campusConnect_email");
            localStorage.removeItem("campus_user_token");
            localStorage.removeItem("firebase_token");
        } catch (e) {}
    }

    function loadStoredSession() {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            const raw = localStorage.getItem(USER_KEY);
            if (!token || !raw) return null;
            const parsed = normalizeUser(JSON.parse(raw));
            return parsed ? { token: token, user: parsed } : null;
        } catch (e) {
            return null;
        }
    }

    function updateNavAuthLinks(user) {
        if (typeof document === "undefined") return;
        document.querySelectorAll("a.nav-signin").forEach(function(link) {
            if (link.closest("#nav-auth-container")) return;
            if (!link.dataset.signinHref) {
                link.dataset.signinHref = link.getAttribute("href") || "Main/signin.html";
            }
            if (user) {
                const firstName = (user.displayName || "Account").trim().split(/\s+/)[0];
                link.textContent = firstName;
                link.setAttribute("href", link.dataset.signinHref.replace(/signin\.html.*$/, "dashboard.html"));
                link.title = "Signed in as " + (user.email || firstName);
            } else {
                link.textContent = "Sign In";
                link.setAttribute("href", link.dataset.signinHref);
                link.removeAttribute("title");
            }
        });
    }

    function notifyListeners(user) {
        updateNavAuthLinks(user);
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
            const stored = loadStoredSession();
            if (stored) {
                currentUser = stored.user;
                notifyListeners(currentUser);
                // Re-verify token silently with backend
                fetch(`${getApiBase()}/api/auth/profile`, {
                    headers: { "Authorization": `Bearer ${stored.token}` }
                }).then(function(res) {
                    if (res.status === 401) {
                        clearSession();
                        notifyListeners(null);
                        return null;
                    }
                    return res.ok ? res.json() : null;
                }).then(function(data) {
                    if (data && data.user) {
                        saveSession(stored.token, data.user);
                        notifyListeners(currentUser);
                    }
                }).catch(function() {});
                return;
            }

            currentUser = null;
            setTimeout(function() {
                notifyListeners(null);
            }, 0);
        },

        getCurrentUser: function() {
            return currentUser;
        },

        isLoggedIn: function() {
            return Boolean(currentUser && localStorage.getItem(TOKEN_KEY));
        },

        onAuthStateChanged: function(callback) {
            authStateListeners.push(callback);
            callback(currentUser);
            return function() {
                authStateListeners = authStateListeners.filter(function(cb) { return cb !== callback; });
            };
        },

        getIdToken: async function() {
            try {
                return localStorage.getItem(TOKEN_KEY) || null;
            } catch (e) {
                return null;
            }
        },

        signIn: async function(email, password) {
            try {
                const res = await fetch(`${getApiBase()}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: String(email || "").trim(),
                        password: String(password || "")
                    })
                });
                const data = await res.json().catch(function() { return {}; });
                if (!res.ok || !data.success || !data.token || !data.user) {
                    return {
                        success: false,
                        error: data.error || "Invalid email or password."
                    };
                }
                saveSession(data.token, data.user);
                notifyListeners(currentUser);
                this.syncGuestFavourites().catch(function() {});
                return { success: true, user: currentUser };
            } catch (err) {
                return {
                    success: false,
                    error: "Could not reach authentication server. Please try again."
                };
            }
        },

        signUp: async function(email, password, fullName) {
            try {
                const res = await fetch(`${getApiBase()}/api/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        full_name: String(fullName || "").trim(),
                        email: String(email || "").trim(),
                        password: String(password || "")
                    })
                });
                const data = await res.json().catch(function() { return {}; });
                if (!res.ok || !data.success || !data.token || !data.user) {
                    return {
                        success: false,
                        error: data.error || "Could not create account."
                    };
                }
                saveSession(data.token, data.user);
                notifyListeners(currentUser);
                this.syncGuestFavourites().catch(function() {});
                return { success: true, user: currentUser };
            } catch (err) {
                return {
                    success: false,
                    error: "Could not reach authentication server. Please try again."
                };
            }
        },

        changePassword: async function(currentPassword, newPassword) {
            const token = await this.getIdToken();
            if (!token) throw new Error("Authentication required");

            const res = await fetch(`${getApiBase()}/api/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword
                })
            });
            const data = await res.json().catch(function() { return {}; });
            if (!res.ok || !data.success) {
                throw new Error(data.error || "Could not update password");
            }
            return data;
        },

        signOut: async function() {
            clearSession();
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
            if (res.status === 401) {
                clearSession();
                notifyListeners(null);
                return null;
            }
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
            const data = await res.json();
            if (data && data.user) {
                saveSession(token, data.user);
                notifyListeners(currentUser);
            }
            return data;
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
