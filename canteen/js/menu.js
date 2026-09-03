// Campus Bites — menu search and category filters

const selectedCanteen = new URLSearchParams(window.location.search).get("canteen");
const canteenTitle = document.querySelector("#canteenTitle");
const searchInput = document.querySelector("#menuSearch");
const menuBoxes = document.querySelectorAll(".menu-box");
const categoryButtons = document.querySelectorAll(".category-btn");
const clearFilters = document.querySelector("#clearFilters");
const noResults = document.querySelector("#noResults");
const resultSummary = document.querySelector("#resultSummary");
const canteenNames = { cafeteria: "Cafeteria", timeless: "Timeless", nescafe: "Nescafe" };
let selectedCategory = "all";

const searchFromHome = new URLSearchParams(window.location.search).get("q");

canteenTitle.textContent = canteenNames[selectedCanteen]
    ? canteenNames[selectedCanteen] + " Menu"
    : "Campus Menu";

if (searchFromHome) searchInput.value = searchFromHome;

function filterMenu() {
    const searchText = searchInput.value.toLowerCase().trim();
    let visibleBoxes = 0;
    let visibleItems = 0;

    menuBoxes.forEach(function (box) {
        const categoryMatches = selectedCategory === "all" || box.dataset.category === selectedCategory;
        let boxHasItems = false;

        box.querySelectorAll(".menu-item").forEach(function (item) {
            const shouldShow = categoryMatches && item.textContent.toLowerCase().includes(searchText);
            item.style.display = shouldShow ? "flex" : "none";
            boxHasItems = boxHasItems || shouldShow;
            if (shouldShow) visibleItems++;
        });

        box.style.display = boxHasItems ? "block" : "none";
        if (boxHasItems) visibleBoxes++;
    });

    noResults.style.display = visibleBoxes ? "none" : "block";
    resultSummary.textContent = visibleItems
        ? visibleItems + " item" + (visibleItems === 1 ? "" : "s") + " showing"
        : "No matching items";
}

categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        selectedCategory = button.dataset.category;
        categoryButtons.forEach(function (item) { item.classList.toggle("active", item === button); });
        filterMenu();
    });
});

searchInput.addEventListener("input", filterMenu);

clearFilters.addEventListener("click", function () {
    searchInput.value = "";
    selectedCategory = "all";
    categoryButtons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.category === "all");
    });
    filterMenu();
    searchInput.focus();
});

function setupMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".navbar nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
}

filterMenu();
setupMobileNav();
