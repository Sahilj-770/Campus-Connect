// Campus Bites — small homepage helpers

const homeNavToggle = document.querySelector(".nav-toggle");
const homeNav = document.querySelector(".navbar nav");
const homeSearch = document.querySelector(".search input");
const themeButton = document.querySelector(".theme-button");

if (homeNavToggle && homeNav) {
    homeNavToggle.addEventListener("click", function () {
        const isOpen = homeNav.classList.toggle("is-open");
        homeNavToggle.setAttribute("aria-expanded", String(isOpen));
        homeNavToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
}

if (homeSearch) {
    homeSearch.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && homeSearch.value.trim()) {
            window.location.href = "menu.html?q=" + encodeURIComponent(homeSearch.value.trim());
        }
    });
}

function setTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    themeButton.textContent = isDark ? "☀" : "☾";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to night mode");
    localStorage.setItem("campusBitesTheme", isDark ? "dark" : "light");
}

if (themeButton) {
    setTheme(localStorage.getItem("campusBitesTheme") === "dark");
    themeButton.addEventListener("click", function () {
        setTheme(!document.body.classList.contains("dark-mode"));
    });
}
