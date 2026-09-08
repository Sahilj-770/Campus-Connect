// =====================================================
// CAMPUS BITES - MENU JAVASCRIPT
// =====================================================


// =====================================================
// 1. SELECT HTML ELEMENTS
// =====================================================

const canteenTitle = document.querySelector("#canteenTitle");

const menuContainer = document.querySelector("#menuContainer");

const searchInput = document.querySelector("#menuSearch");

const categoryButtonsContainer =
    document.querySelector(".category-buttons");

const clearFilters =
    document.querySelector("#clearFilters");

const noResults =
    document.querySelector("#noResults");

const resultSummary =
    document.querySelector("#resultSummary");


// =====================================================
// 2. GET CANTEEN FROM URL
// =====================================================

// Example:
// menu.html?canteen=cafeteria

const urlParams = new URLSearchParams(window.location.search);

const selectedCanteen = urlParams.get("canteen");

console.log("Selected canteen:", selectedCanteen);


// =====================================================
// 3. CANTEEN NAME
// =====================================================

const canteenNames = {
    cafeteria: "Cafeteria Menu",
    timeless: "Timeless Menu",
    nescafe: "Nescafe Menu"
};

if (canteenNames[selectedCanteen]) {

    canteenTitle.textContent =
        canteenNames[selectedCanteen];

} else {

    canteenTitle.textContent = "Campus Menu";
}


// =====================================================
// 4. VARIABLES FOR MENU DATA
// =====================================================

// This array will contain the data
// received from MySQL.

let menuData = [];


// This stores the currently selected category.

let selectedCategory = "all";


// =====================================================
// 5. CATEGORY ICONS
// =====================================================

// These icons are only for visual appearance.

const categoryIcons = {

    "Breakfast": "🍳",

    "South Indian": "🥞",

    "Chinese": "🍜",

    "Chapati / Paratha": "🫓",

    "Rice": "🍚",

    "Sandwich": "🥪",

    "Maggi": "🍜",

    "Beverages": "☕",

    "Pasta": "🍝",

    "Thali": "🍛",

    "Chat": "🥟"

};


// =====================================================
// 6. FETCH MENU FROM BACKEND
// =====================================================

function loadMenu() {

    // Check whether a canteen was selected.

    if (!selectedCanteen) {

        showError("Please select a canteen first.");

        return;
    }


    // API URL

    const apiURL =
        "http://localhost:3000/api/menu/"
        + selectedCanteen;


    console.log("Fetching menu from:", apiURL);


    // Fetch data from Express backend.

    fetch(apiURL)

        .then(function(response) {

            // Check whether server responded successfully.

            if (!response.ok) {

                throw new Error(
                    "Server returned an error."
                );
            }

            // Convert response into JavaScript data.

            return response.json();

        })

        .then(function(data) {

            console.log("Menu received from database:");
            console.log(data);


            // Check if backend returned an error.

            if (data.error) {

                throw new Error(data.error);
            }


            // Store database data.

            menuData = data;


            // Create category buttons.

            createCategoryButtons();


            // Display menu.

            displayMenu();


        })

        .catch(function(error) {

            console.log("Menu loading error:", error);

            showError(
                "Unable to load menu. Make sure the backend is running."
            );

        });
}


// =====================================================
// 7. CREATE CATEGORY BUTTONS
// =====================================================

function createCategoryButtons() {

    // Remove existing buttons.

    categoryButtonsContainer.innerHTML = "";


    // Create ALL button.

    const allButton = document.createElement("button");

    allButton.classList.add(
        "category-btn",
        "active"
    );

    allButton.dataset.category = "all";

    allButton.textContent = "All";


    categoryButtonsContainer.appendChild(allButton);


    // Get unique categories from database.

    const categories = [];


    menuData.forEach(function(item) {

        if (!categories.includes(item.category)) {

            categories.push(item.category);

        }

    });


    console.log("Categories:", categories);


    // Create a button for every category.

    categories.forEach(function(category) {

        const button = document.createElement("button");

        button.classList.add("category-btn");

        button.dataset.category = category;


        // Get icon for category.

        const icon =
            categoryIcons[category] || "🍽️";


        button.textContent =
            icon + " " + category;


        categoryButtonsContainer.appendChild(button);

    });


    // Add click events.

    const categoryButtons =
        document.querySelectorAll(".category-btn");


    categoryButtons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                // Store selected category.

                selectedCategory =
                    button.dataset.category;


                // Remove active from all buttons.

                categoryButtons.forEach(
                    function(btn) {

                        btn.classList.remove("active");

                    }
                );


                // Add active to clicked button.

                button.classList.add("active");


                // Display filtered menu.

                displayMenu();

            }
        );

    });
}


// =====================================================
// 8. DISPLAY MENU
// =====================================================

function displayMenu() {

    // Remove previous menu.

    menuContainer.innerHTML = "";


    // Get search text.

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    // Filter menu items.

    const filteredItems =
        menuData.filter(function(item) {


            // Check category.

            const categoryMatches =
                selectedCategory === "all"
                ||
                item.category === selectedCategory;


            // Check search.

            const nameMatches =
                item.item_name
                    .toLowerCase()
                    .includes(searchText);


            const descriptionMatches =
                item.description
                    &&
                item.description
                    .toLowerCase()
                    .includes(searchText);


            const categorySearchMatches =
                item.category
                    .toLowerCase()
                    .includes(searchText);


            const searchMatches =
                searchText === ""
                ||
                nameMatches
                ||
                descriptionMatches
                ||
                categorySearchMatches;


            return categoryMatches && searchMatches;

        });


    console.log(
        "Filtered items:",
        filteredItems
    );


    // =================================================
    // NO RESULTS
    // =================================================

    if (filteredItems.length === 0) {

        noResults.style.display = "block";

        resultSummary.textContent =
            "No menu items found.";

        return;

    }


    // Hide no-results message.

    noResults.style.display = "none";


    // =================================================
    // GROUP ITEMS BY CATEGORY
    // =================================================

    const groupedMenu = {};


    filteredItems.forEach(function(item) {

        if (!groupedMenu[item.category]) {

            groupedMenu[item.category] = [];

        }

        groupedMenu[item.category].push(item);

    });


    // =================================================
    // CREATE CATEGORY BOXES
    // =================================================

    Object.keys(groupedMenu).forEach(
        function(category) {


            // Create category box.

            const menuBox =
                document.createElement("div");

            menuBox.classList.add("menu-box");

            menuBox.dataset.category =
                category;


            // Create heading.

            const heading =
                document.createElement("h2");


            const icon =
                categoryIcons[category]
                || "🍽️";


            heading.textContent =
                icon + " " + category;


            menuBox.appendChild(heading);


            // Create items container.

            const itemsContainer =
                document.createElement("div");

            itemsContainer.classList.add(
                "menu-items"
            );


            // =================================================
            // CREATE EACH MENU ITEM
            // =================================================

            groupedMenu[category].forEach(
                function(item) {


                    // Create menu item.

                    const menuItem =
                        document.createElement("div");

                    menuItem.classList.add(
                        "menu-item"
                    );


                    // =================================================
                    // ITEM INFORMATION
                    // =================================================

                    const itemInfo =
                        document.createElement("div");

                    itemInfo.classList.add(
                        "item-info"
                    );


                    // Item name.

                    const itemName =
                        document.createElement("span");

                    itemName.textContent =
                        item.item_name;


                    itemInfo.appendChild(itemName);


                    // Description.

                    if (item.description) {

                        const description =
                            document.createElement("small");

                        description.textContent =
                            item.description;


                        itemInfo.appendChild(
                            description
                        );

                    }


                    // =================================================
                    // RIGHT SIDE
                    // =================================================

                    const itemRight =
                        document.createElement("div");

                    itemRight.classList.add(
                        "item-right"
                    );


                    // Price.

                    const price =
                        document.createElement("strong");

                    price.textContent =
                        "₹" + Number(item.price);


                    itemRight.appendChild(price);


                    // =================================================
                    // AVAILABILITY
                    // =================================================

                    if (item.availability) {

                        const availability =
                            document.createElement("small");


                        availability.textContent =
                            item.availability;


                        availability.classList.add(
                            "availability"
                        );


                        if (
                            item.availability
                                .toLowerCase()
                                .includes("not")
                        ) {

                            availability.classList.add(
                                "unavailable"
                            );

                        }

                        itemRight.appendChild(
                            availability
                        );

                    }


                    // Add right side.

                    menuItem.appendChild(itemInfo);

                    menuItem.appendChild(itemRight);


                    // Add item to category.

                    itemsContainer.appendChild(
                        menuItem
                    );

                }
            );


            // Add items container.

            menuBox.appendChild(
                itemsContainer
            );


            // Add category box to page.

            menuContainer.appendChild(
                menuBox
            );

        }
    );


    // =================================================
    // RESULT COUNT
    // =================================================

    resultSummary.textContent =
        filteredItems.length
        + " menu item"
        + (filteredItems.length === 1 ? "" : "s")
        + " found.";

}


// =====================================================
// 9. SEARCH FUNCTION
// =====================================================

searchInput.addEventListener(
    "input",
    function() {

        displayMenu();

    }
);


// =====================================================
// 10. CLEAR FILTERS
// =====================================================

clearFilters.addEventListener(
    "click",
    function() {


        // Clear search box.

        searchInput.value = "";


        // Reset category.

        selectedCategory = "all";


        // Reset active button.

        const categoryButtons =
            document.querySelectorAll(
                ".category-btn"
            );


        categoryButtons.forEach(
            function(button) {

                button.classList.remove(
                    "active"
                );

            }
        );


        const allButton =
            document.querySelector(
                '.category-btn[data-category="all"]'
            );


        if (allButton) {

            allButton.classList.add("active");

        }


        // Display complete menu.

        displayMenu();

    }
);


// =====================================================
// 11. SHOW ERROR
// =====================================================

function showError(message) {

    menuContainer.innerHTML = "";


    noResults.style.display = "block";


    const heading =
        noResults.querySelector("h2");


    const paragraph =
        noResults.querySelector("p");


    if (heading) {

        heading.textContent =
            "Menu unavailable";

    }


    if (paragraph) {

        paragraph.textContent =
            message;

    }

}


// =====================================================
// 12. START THE APPLICATION
// =====================================================

loadMenu();