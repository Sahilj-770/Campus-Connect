
"use strict";

// =====================================================
// 1. ELEMENTS AND BACKEND CONFIGURATION
// =====================================================

const searchInput = document.querySelector("#menuSearch");
const clearSearchButton = document.querySelector("#clearSearch");
const menuContainer = document.querySelector("#menuContainer");
const noResults = document.querySelector("#noResults");
const resultSummary = document.querySelector("#resultSummary");
const canteenTitle = document.querySelector("#canteenTitle");
const clearFiltersButton = document.querySelector("#clearFilters");

const BACKEND_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:3000"
        : "https://campus-connect-s85n.onrender.com";

// Availability refresh interval: 5 seconds.
const AVAILABILITY_REFRESH_INTERVAL = 5000;

// =====================================================
// 2. FOOD IMAGE URL
// =====================================================

function getImageUrl(itemName) {
    const slug = String(itemName || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return `${BACKEND_URL}/food-images/${slug}.webp`;
}

// =====================================================
// 3. CANTEEN AND CATEGORY DATA
// =====================================================

const canteenNames = {
    cafeteria: "Cafeteria",
    timeless: "Timeless",
    nescafe: "Nescafe"
};

const categoryIcons = {
    "Breakfast": "🍳",
    "South Indian": "🥞",
    "Chinese": "🍜",
    "Chapati / Paratha": "🫓",
    "Rice": "🍚",
    "Sandwich": "🥪",
    "Sandwiches": "🥪",
    "Maggi": "🍜",
    "Beverages": "☕",
    "Pasta": "🍝",
    "Thali": "🍛",
    "Chat": "🥟"
};

const categoryGroups = {
    "full-meals": [
        "breakfast", "south indian", "chapati", "paratha",
        "rice", "thali", "full meal", "full meals", "meal"
    ],
    "coffee-drinks": [
        "beverage", "beverages", "coffee", "drink", "drinks",
        "cooler", "juice", "tea"
    ],
    "quick-bites": [
        "sandwich", "maggi", "chat", "snack", "snacks",
        "quick bite", "quick bites", "pasta", "chinese"
    ]
};

let allMenuItems = [];
let selectedCanteen = "all";
let selectedFilter = "all";
let selectedCategory = "all";
let isInitialLoadComplete = false;
let isRefreshingAvailability = false;

// Lookup maps for updating existing cards without rebuilding them.
const menuItemsByKey = new Map();
const menuCardsByKey = new Map();

// =====================================================
// 4. ITEM HELPERS
// =====================================================

function getFoodKey(item) {
    return String(item.canteen || "") + "::" +
        String(item.item_id ?? item.item_name ?? "");
}

function getItemName(item) {
    return String(item.item_name || item.name || "Food Item");
}

function getItemId(item) {
    return String(item.item_id ?? item.id ?? "");
}

// Convert common database values into a consistent status.


function isItemUnavailable(item) {
    // Handle missing or invalid menu items safely.
    if (!item || typeof item !== "object") {
        return true;
    }

    if (
        item.is_available !== undefined &&
        item.is_available !== null &&
        item.is_available !== ""
    ) {
        const isAvailable = Number(item.is_available);

        if (isAvailable === 1) {
            return false; // Available
        }

        if (isAvailable === 0) {
            return true; // Not available
        }

        return true;
    }

    const availability = String(
        item.availability || ""
    ).trim().toLowerCase();

    if (availability === "available") {
        return false;
    }

    return true;
}


// =====================================================
// 5. FAVOURITES
// =====================================================

function getVisitorId() {
    const storageKey = "campusBitesVisitorId";

    try {
        let visitorId = localStorage.getItem(storageKey);

        if (!visitorId) {
            visitorId =
                window.crypto &&
                typeof window.crypto.randomUUID === "function"
                    ? window.crypto.randomUUID()
                    : "visitor-" + Date.now() + "-" +
                      Math.random().toString(36).slice(2);

            localStorage.setItem(storageKey, visitorId);
        }

        return visitorId;
    } catch (error) {
        console.error("Could not access visitor ID storage:", error);

        return "temporary-" +
            Math.random().toString(36).slice(2);
    }
}

const visitorId = getVisitorId();

function readFavorites() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("campusBitesFoodFavorites") || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.error("Could not read favourites:", error);
        return [];
    }
}

let favoriteFoods = readFavorites();

function saveFavorites() {
    try {
        localStorage.setItem(
            "campusBitesFoodFavorites",
            JSON.stringify(favoriteFoods)
        );
    } catch (error) {
        console.error("Could not save favourites locally:", error);
    }
}

function isFavorite(item) {
    return favoriteFoods.includes(getFoodKey(item));
}

function updateFavoriteButton(item, button) {
    const saved = isFavorite(item);
    const name = getItemName(item);

    button.textContent = saved ? "♥" : "♡";
    button.classList.toggle("active", saved);
    button.setAttribute("aria-pressed", String(saved));
    button.setAttribute(
        "aria-label",
        saved
            ? `Remove ${name} from favourites`
            : `Add ${name} to favourites`
    );

    button.title = saved
        ? "Remove from favourites"
        : "Add to favourites";
}

function refreshFavoriteButtons() {
    document.querySelectorAll(".food-favorite").forEach(button => {
        const item = menuItemsByKey.get(button.dataset.foodKey);

        if (item) {
            updateFavoriteButton(item, button);
        }
    });
}

async function sendFavoriteToServer(item, shouldSave) {
    const payload = {
        visitorId,
        canteen: item.canteen,
        item_id: getItemId(item)
    };

    try {
        const response = await fetch(
            `${BACKEND_URL}/api/favourites`,
            {
                method: shouldSave ? "POST" : "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();

        if (!response.ok || data.success !== true) {
            throw new Error(
                data.error || `HTTP ${response.status}`
            );
        }

        return true;
    } catch (error) {
        console.error("Could not sync favourite:", error);
        alert("Could not save this favourite. Please try again.");
        return false;
    }
}

async function toggleFavorite(item, button) {
    if (button.disabled) return;

    button.disabled = true;

    const key = getFoodKey(item);
    const shouldSave = !favoriteFoods.includes(key);

    try {
        const success = await sendFavoriteToServer(item, shouldSave);

        if (!success) return;

        if (shouldSave) {
            if (!favoriteFoods.includes(key)) {
                favoriteFoods.push(key);
            }
        } else {
            favoriteFoods = favoriteFoods.filter(
                savedKey => savedKey !== key
            );
        }

        saveFavorites();
        updateFavoriteButton(item, button);

        window.dispatchEvent(
            new Event("campusBitesFavoritesUpdated")
        );
    } finally {
        button.disabled = false;
    }
}

async function loadServerFavorites() {
    try {
        const response = await fetch(
            `${BACKEND_URL}/api/favourites/${encodeURIComponent(visitorId)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const serverFavorites = await response.json();

        if (!Array.isArray(serverFavorites)) {
            throw new Error("Invalid favourites response");
        }

        const serverKeys = serverFavorites.map(favorite =>
            `${favorite.canteen}::${favorite.item_id}`
        );

        const serverKeySet = new Set(serverKeys);
        const localKeysBeforeMerge = new Set(favoriteFoods);

        favoriteFoods = Array.from(
            new Set([...favoriteFoods, ...serverKeys])
        );

        saveFavorites();

        const localItemsToSync = allMenuItems.filter(item => {
            const key = getFoodKey(item);

            return localKeysBeforeMerge.has(key) &&
                !serverKeySet.has(key);
        });

        await Promise.all(
            localItemsToSync.map(item =>
                sendFavoriteToServer(item, true)
            )
        );

        refreshFavoriteButtons();

        window.dispatchEvent(
            new Event("campusBitesFavoritesUpdated")
        );
    } catch (error) {
        console.warn("Could not sync favourites:", error);
    }
}

// =====================================================
// 6. CANTEEN OPEN/CLOSED SCHEDULE
// =====================================================

function checkCanteenStatus() {
    const istTime = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata"
        })
    );

    const dayOfWeek = istTime.getDay();
    const currentHour = istTime.getHours();

    const year = istTime.getFullYear();
    const month = String(istTime.getMonth() + 1).padStart(2, "0");
    const date = String(istTime.getDate()).padStart(2, "0");
    const todayDate = `${year}-${month}-${date}`;

    const openingHour = 9;
    const closingHour = 17;
    const closedDays = [0];
    const holidays = ["2026-10-31", "2026-11-01"];

    if (closedDays.includes(dayOfWeek)) return false;
    if (currentHour < openingHour || currentHour >= closingHour) {
        return false;
    }
    if (holidays.includes(todayDate)) return false;

    return true;
}

// =====================================================
// 7. UPDATE AVAILABILITY ON AN EXISTING CARD
// =====================================================

// This updates only the status and cart button.
// It does not recreate cards or reload images.
function updateCardAvailability(item) {
    const key = getFoodKey(item);
    const card = menuCardsByKey.get(key);

    if (!card || !card.isConnected) return;

    const unavailable = isItemUnavailable(item);
    const status = card.querySelector(".availability");
    const addButton = card.querySelector(".add-cart");

    if (status) {
        status.textContent = unavailable
            ? "Not Available"
            : "Available";

        status.classList.toggle("unavailable", unavailable);
        status.style.color = unavailable ? "#d32f2f" : "#2e7d32";
    }

    if (addButton) {
        addButton.disabled = unavailable;
        addButton.style.opacity = unavailable ? "0.5" : "1";
        addButton.style.cursor = unavailable
            ? "not-allowed"
            : "pointer";

        addButton.textContent = unavailable
            ? "Currently Unavailable"
            : "🛒 Add to Cart";
    }

    card.classList.toggle("item-unavailable", unavailable);
}

// =====================================================
// 8. REFRESH AVAILABILITY FROM THE DATABASE
// =====================================================

async function refreshMenuAvailability() {
    if (isRefreshingAvailability || !isInitialLoadComplete) {
        return;
    }

    isRefreshingAvailability = true;

    try {
        const canteens = ["cafeteria", "timeless", "nescafe"];

        const results = await Promise.all(
            canteens.map(async canteen => {
                const response = await fetch(
                    `${BACKEND_URL}/api/menu/${canteen}`,
                    { cache: "no-store" }
                );

                if (!response.ok) {
                    throw new Error(
                        `${canteen} API returned HTTP ${response.status}`
                    );
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error(
                        `Invalid menu response for ${canteen}`
                    );
                }

                return data.map(item => ({
                    ...item,
                    canteen
                }));
            })
        );

        const latestItems = results.flat();

        // Update existing objects with the newest database values.
        latestItems.forEach(latestItem => {
            const key = getFoodKey(latestItem);
            const existingItem = menuItemsByKey.get(key);

            if (!existingItem) {
                // A new item needs a full menu refresh to appear.
                return;
            }

            Object.assign(existingItem, latestItem);

            // Update the card without recreating it.
            updateCardAvailability(existingItem);
        });

        // If the database added or removed items, refresh the full menu.
        const latestKeys = new Set(
            latestItems.map(item => getFoodKey(item))
        );

        const currentKeys = new Set(
            allMenuItems.map(item => getFoodKey(item))
        );

        const menuStructureChanged =
            latestKeys.size !== currentKeys.size ||
            [...latestKeys].some(key => !currentKeys.has(key));

        if (menuStructureChanged) {
            allMenuItems = latestItems;

            menuItemsByKey.clear();

            allMenuItems.forEach(item => {
                menuItemsByKey.set(getFoodKey(item), item);
            });

            displayMenu();
        }

        console.log("Menu availability refreshed:", new Date().toLocaleTimeString());
    } catch (error) {
        // Keep the current UI if a temporary network request fails.
        console.warn("Availability refresh failed:", error.message);
    } finally {
        isRefreshingAvailability = false;
    }
}

// =====================================================
// 9. LOAD ALL THREE CANTEEN MENUS
// =====================================================

async function loadAllMenus() {
    if (!menuContainer) {
        console.error("Could not find #menuContainer in menu.html");
        return;
    }

    menuContainer.innerHTML = "<p>Loading menu items...</p>";

    if (noResults) noResults.hidden = true;

    const canteens = ["cafeteria", "timeless", "nescafe"];

    try {
        const results = await Promise.all(
            canteens.map(async canteen => {
                const response = await fetch(
                    `${BACKEND_URL}/api/menu/${canteen}`,
                    { cache: "no-store" }
                );

                if (!response.ok) {
                    throw new Error(
                        `${canteen} returned HTTP ${response.status}`
                    );
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error(
                        `Expected menu items array for ${canteen}`
                    );
                }

                return data.map(item => ({
                    ...item,
                    canteen
                }));
            })
        );

        allMenuItems = results.flat();

        menuItemsByKey.clear();

        allMenuItems.forEach(item => {
            menuItemsByKey.set(getFoodKey(item), item);
        });

        initialiseFiltersFromURL();
        updateFilterButtons();
        updateCategoryButtons();
        displayMenu();

        isInitialLoadComplete = true;

        await loadServerFavorites();

        // Start automatic availability refresh.
        refreshMenuAvailability();

    } catch (error) {
        console.error("Menu loading error:", error);

        menuContainer.innerHTML = "";

        if (noResults) {
            noResults.hidden = false;

            const heading = noResults.querySelector("h2");
            const paragraph = noResults.querySelector("p");

            if (heading) heading.textContent = "Menu unavailable";

            if (paragraph) {
                paragraph.textContent =
                    "Could not load the menu. Please check the backend connection.";
            }
        }

        if (resultSummary) {
            resultSummary.textContent =
                "Menu could not be loaded. Check the console.";
        }
    }
}

// =====================================================
// 10. READ URL PARAMETERS
// =====================================================

function initialiseFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);

    const canteenParam = params.get("canteen");
    const filterParam = params.get("filter");
    const searchParam =
        params.get("q") || params.get("search") || "";

    if (canteenParam && canteenNames[canteenParam]) {
        selectedCanteen = canteenParam;
    }

    if (filterParam && categoryGroups[filterParam]) {
        selectedFilter = filterParam;
    }

    if (searchInput) {
        searchInput.value = searchParam.trim();
    }

    if (filterParam && categoryGroups[filterParam]) {
        setTimeout(() => {
            const menuSection = document.querySelector(".menu-content");

            if (menuSection) {
                menuSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }, 100);
    }
}

// =====================================================
// 11. UPDATE FILTER BUTTONS
// =====================================================

function updateFilterButtons() {
    document.querySelectorAll(".canteen-filter").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.canteen === selectedCanteen
        );
    });

    document.querySelectorAll(".food-filter").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === selectedFilter
        );
    });
}

function updateCategoryButtons() {
    document.querySelectorAll(".category-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.category === selectedCategory
        );
    });
}

// =====================================================
// 12. FOOD-TYPE FILTERS
// =====================================================

function matchesFoodFilter(item, filter) {
    if (filter === "all") return true;

    const category = String(item.category || "").toLowerCase();
    const name = getItemName(item).toLowerCase();
    const keywords = categoryGroups[filter] || [];

    return keywords.some(keyword =>
        category.includes(keyword) || name.includes(keyword)
    );
}

// =====================================================
// 13. UPDATE MENU TITLE
// =====================================================

function updateTitle() {
    if (!canteenTitle) return;

    const canteenText = selectedCanteen === "all"
        ? "All campus food"
        : `${canteenNames[selectedCanteen] || selectedCanteen} menu`;

    const filterText = {
        all: "",
        "full-meals": " · Full meals",
        "coffee-drinks": " · Coffee & drinks",
        "quick-bites": " · Quick bites"
    }[selectedFilter] || "";

    canteenTitle.textContent = canteenText + filterText;
}

// =====================================================
// 14. CREATE A FOOD CARD
// =====================================================

function createFoodCard(item) {
    const key = getFoodKey(item);
    const card = document.createElement("article");

    card.className = "menu-item";
    card.dataset.foodKey = key;

    // Food image.
    const image = document.createElement("img");
    image.className = "food-image";
    image.alt = getItemName(item);
    image.loading = "lazy";
    image.decoding = "async";
    image.src = getImageUrl(getItemName(item));

    image.onerror = function () {
        image.onerror = null;
        image.src =
            "https://placehold.co/600x400/f3eee9/76675e?text=" +
            encodeURIComponent(getItemName(item));
    };

    // Favourite button.
    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "food-favorite";
    favoriteButton.dataset.foodKey = key;

    updateFavoriteButton(item, favoriteButton);

    favoriteButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(item, favoriteButton);
    });

    // Item details.
    const details = document.createElement("div");
    details.className = "item-details";

    const badge = document.createElement("span");
    badge.className = "canteen-badge";
    badge.textContent =
        canteenNames[item.canteen] || item.canteen;

    const title = document.createElement("h3");
    title.textContent = getItemName(item);

    const description = document.createElement("p");
    description.className = "item-description";
    description.textContent =
        item.description || "A campus favourite.";

    // Price and availability.
    const bottom = document.createElement("div");
    bottom.className = "item-bottom";

    const price = document.createElement("strong");
    price.className = "item-price";
    price.textContent = "₹" + Number(item.price || 0);

    const availability = document.createElement("span");
    availability.className = "availability";

    // Cart button.
    const addButton = document.createElement("button");
    addButton.className = "add-cart";
    addButton.type = "button";

    addButton.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        // Recheck the latest item status before adding to cart.
        if (isItemUnavailable(item)) {
            updateCardAvailability(item);
            return;
        }

        if (typeof window.addToCart === "function") {
            window.addToCart(item, addButton);
        } else {
            alert("Cart script is not loaded. Check your cart script.");
        }
    });

    bottom.append(price, availability);
    details.append(badge, title, description, bottom, addButton);
    card.append(image, favoriteButton, details);

    menuCardsByKey.set(key, card);

    // Set the initial availability display.
    updateCardAvailability(item);

    return card;
}

// =====================================================
// 15. SEARCH AND DISPLAY MENU ITEMS
// =====================================================

function displayMenu() {
    if (!menuContainer) return;

    menuContainer.innerHTML = "";
    menuCardsByKey.clear();

    const searchText = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const filteredItems = allMenuItems.filter(item => {
        const matchesCanteen =
            selectedCanteen === "all" ||
            item.canteen === selectedCanteen;

        const matchesFilter =
            matchesFoodFilter(item, selectedFilter);

        const matchesCategory =
            selectedCategory === "all" ||
            item.category === selectedCategory;

        const name = getItemName(item).toLowerCase();
        const description = String(item.description || "").toLowerCase();
        const category = String(item.category || "").toLowerCase();

        const matchesSearch =
            !searchText ||
            name.includes(searchText) ||
            description.includes(searchText) ||
            category.includes(searchText);

        return matchesCanteen &&
            matchesFilter &&
            matchesCategory &&
            matchesSearch;
    });

    updateTitle();

    if (resultSummary) {
        resultSummary.textContent =
            `${filteredItems.length} food item` +
            (filteredItems.length === 1 ? "" : "s") +
            " found";
    }

    if (filteredItems.length === 0) {
        if (noResults) {
            noResults.hidden = false;

            const heading = noResults.querySelector("h2");
            const paragraph = noResults.querySelector("p");

            if (heading) heading.textContent = "No food items found";

            if (paragraph) {
                paragraph.textContent = searchText
                    ? `No dishes match "${searchText}". Try another search or clear your filters.`
                    : "Try selecting another canteen or food type.";
            }
        }

        return;
    }

    if (noResults) noResults.hidden = true;

    const grouped = {};

    filteredItems.forEach(item => {
        const category = item.category || "Other";

        if (!grouped[category]) {
            grouped[category] = [];
        }

        grouped[category].push(item);
    });

    Object.keys(grouped).sort().forEach(category => {
        const section = document.createElement("section");
        section.className = "menu-box";

        const heading = document.createElement("h2");
        heading.textContent =
            (categoryIcons[category] || "🍽️") + " " + category;

        const grid = document.createElement("div");
        grid.className = "menu-items";

        grouped[category].forEach(item => {
            grid.appendChild(createFoodCard(item));
        });

        section.append(heading, grid);
        menuContainer.appendChild(section);
    });
}

// =====================================================
// 16. CANTEEN FILTER BUTTONS
// =====================================================

document.querySelectorAll(".canteen-filter").forEach(button => {
    button.addEventListener("click", () => {
        selectedCanteen = button.dataset.canteen || "all";

        updateFilterButtons();
        displayMenu();
    });
});

// =====================================================
// 17. FOOD-TYPE FILTER BUTTONS
// =====================================================

document.querySelectorAll(".food-filter").forEach(button => {
    button.addEventListener("click", () => {
        selectedFilter = button.dataset.filter || "all";
        selectedCategory = "all";

        updateFilterButtons();
        updateCategoryButtons();
        displayMenu();
    });
});

// =====================================================
// 18. CATEGORY FILTER BUTTONS
// =====================================================

document.querySelectorAll(".category-btn").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category || "all";

        updateCategoryButtons();
        displayMenu();
    });
});

// =====================================================
// 19. SEARCH BAR
// =====================================================

if (searchInput) {
    searchInput.addEventListener("input", displayMenu);
}

if (clearSearchButton) {
    clearSearchButton.addEventListener("click", () => {
        if (searchInput) {
            searchInput.value = "";
            searchInput.focus();
        }

        displayMenu();
    });
}

// =====================================================
// 20. CLEAR ALL FILTERS
// =====================================================

if (clearFiltersButton) {
    clearFiltersButton.addEventListener("click", () => {
        selectedCanteen = "all";
        selectedFilter = "all";
        selectedCategory = "all";

        if (searchInput) searchInput.value = "";

        updateFilterButtons();
        updateCategoryButtons();
        displayMenu();

        window.history.replaceState(
            {},
            "",
            window.location.pathname
        );
    });
}

// =====================================================
// 21. INITIALISE AND AUTOMATICALLY REFRESH
// =====================================================

loadAllMenus();

// Refresh availability every five seconds.
// This does not rebuild the cards when only availability changes.
window.setInterval(
    refreshMenuAvailability,
    AVAILABILITY_REFRESH_INTERVAL
);

// Refresh when the user returns to this browser tab.
document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        refreshMenuAvailability();
    }
});
