/**
 * CampusConnect Client Configuration
 */
(function() {
    window.CAMPUS_CONNECT_FIREBASE_CONFIG = null;

    // Determine Backend API Base URLs
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    window.CAMPUS_CONNECT_API_BASE = isLocalhost
        ? "http://localhost:3000"
        : "https://campus-connect-s85n.onrender.com";

    window.CAMPUS_CONNECT_LF_API_BASE = isLocalhost
        ? "http://localhost:3000/api/lost-found"
        : "https://campus-connect-s85n.onrender.com/api/lost-found";
})();
