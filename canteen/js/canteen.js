// Campus Bites — canteen cards, favourites and opening status

const canteenCards = document.querySelectorAll(".canteen-card");
const favoriteButtons = document.querySelectorAll(".favorite-btn");
const favoriteMessage = document.querySelector("#favoriteMessage");
let favoriteCanteens = JSON.parse(localStorage.getItem("favoriteCanteens")) || [];
let messageTimer;

function showMessage(message) {
    window.clearTimeout(messageTimer);
    favoriteMessage.textContent = message;
    messageTimer = window.setTimeout(function () {
        favoriteMessage.textContent = "";
    }, 2800);
}

function setFavoriteState(button, isFavorite) {
    const name = button.getAttribute("aria-label").replace("Favorite ", "").replace("Remove ", "");
    button.textContent = isFavorite ? "♥" : "♡";
    button.classList.toggle("active", isFavorite);
    button.setAttribute("aria-label", (isFavorite ? "Remove " : "Favorite ") + name);
    button.setAttribute("aria-pressed", String(isFavorite));
}

favoriteButtons.forEach(function (button) {
    const canteen = button.dataset.favorite;
    setFavoriteState(button, favoriteCanteens.includes(canteen));

    button.addEventListener("click", function (event) {
        event.stopPropagation();
        const isFavorite = favoriteCanteens.includes(canteen);
        favoriteCanteens = isFavorite
            ? favoriteCanteens.filter(function (item) { return item !== canteen; })
            : favoriteCanteens.concat(canteen);

        setFavoriteState(button, !isFavorite);
        localStorage.setItem("favoriteCanteens", JSON.stringify(favoriteCanteens));
        showMessage(isFavorite ? "Removed from your favourites." : "Saved to your favourites.");
    });
});

function openMenu(card) {
    window.location.href = "menu.html?canteen=" + card.dataset.canteen;
}

canteenCards.forEach(function (card) {
    card.addEventListener("click", function (event) {
        if (!event.target.closest("a, button")) openMenu(card);
    });

    card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openMenu(card);
        }
    });
});

function updateCanteenStatus() {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    canteenCards.forEach(function (card) {
        const opening = Number(card.dataset.opening);
        const closing = Number(card.dataset.closing);
        const status = card.querySelector(".status");
        const openTime = card.querySelector(".open-time");
        const isOpen = currentHour >= opening && currentHour < closing;

        status.textContent = isOpen ? "Open now" : "Closed";
        status.classList.toggle("closed", !isOpen);
        openTime.textContent = isOpen ? "Open right now" : "Opens at " + formatTime(opening);
    });
}

function formatTime(time) {
    const hour = Math.floor(time);
    const minutes = time % 1 ? "30" : "00";
    const period = hour >= 12 ? "PM" : "AM";
    return (hour % 12 || 12) + ":" + minutes + " " + period;
}

function setupMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".navbar nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });

    nav.addEventListener("click", function (event) {
        if (event.target.matches("a")) {
            nav.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });
}

updateCanteenStatus();
setupMobileNav();
