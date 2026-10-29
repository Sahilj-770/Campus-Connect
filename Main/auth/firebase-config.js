/**
 * CampusConnect Client Configuration
 * Public Student Project Mode — No dummy credentials or secret keys.
 */
(function() {
    // Client Firebase authentication is disabled in open campus guest mode
    window.CAMPUS_CONNECT_FIREBASE_CONFIG = null;

    // Determine Backend API Base URLs
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    window.CAMPUS_CONNECT_API_BASE = isLocalhost
        ? "http://localhost:3000"
        : "https://campus-connect-1-0q94.onrender.com";

    window.CAMPUS_CONNECT_LF_API_BASE = isLocalhost
        ? "http://localhost:3000/api/lost-found"
        : "https://campus-connect-4n2t.onrender.com";
})();
