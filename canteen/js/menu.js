// =====================================================
// CAMPUS BITES - MENU JAVASCRIPT
// =====================================================

// -----------------------------------------------------
// 1. SELECT HTML ELEMENTS
// -----------------------------------------------------

const canteenTitle = document.querySelector("#canteenTitle");
const menuContainer = document.querySelector("#menuContainer");
const searchInput = document.querySelector("#menuSearch");
const categoryButtonsContainer =
    document.querySelector(".category-buttons");
const clearFilters = document.querySelector("#clearFilters");
const noResults = document.querySelector("#noResults");
const resultSummary = document.querySelector("#resultSummary");


// -----------------------------------------------------
// 2. GET CANTEEN FROM URL
// -----------------------------------------------------

const urlParams = new URLSearchParams(window.location.search);

let selectedCanteen = urlParams.get("canteen");


// -----------------------------------------------------
// 3. DEFAULT CANTEEN
// -----------------------------------------------------
// If someone opens menu.html directly,
// show Cafeteria instead of showing an error.

if (!selectedCanteen) {
    selectedCanteen = "cafeteria";
}


// -----------------------------------------------------
// 4. CANTEEN NAMES
// -----------------------------------------------------

const canteenNames = {
    cafeteria: "Cafeteria Menu",
    timeless: "Timeless Menu",
    nescafe: "Nescafe Menu"
};

canteenTitle.textContent =
    canteenNames[selectedCanteen] || "Campus Menu";


// -----------------------------------------------------
// 5. MENU DATA
// -----------------------------------------------------

let menuData = [];
let selectedCategory = "all";


// -----------------------------------------------------
// 6. CATEGORY ICONS
// -----------------------------------------------------

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


// -----------------------------------------------------
// 7. LOAD MENU FROM DATABASE
// -----------------------------------------------------

function loadMenu() {

    const apiURL =
        "http://localhost:3000/api/menu/" + selectedCanteen;

    console.log("Loading:", apiURL);

    fetch(apiURL)

        .then(function(response) {

            if (!response.ok) {
                throw new Error("Server error");
            }

            return response.json();
        })

        .then(function(data) {

            console.log("Database data:", data);

            if (data.error) {
                throw new Error(data.error);
            }

            menuData = data;

            createCategoryButtons();

            displayMenu();
        })

        .catch(function(error) {

            console.error("Menu loading error:", error);

            showError(
                "Unable to load menu. Make sure the backend server is running."
            );
        });
}


// -----------------------------------------------------
// 8. CREATE CATEGORY BUTTONS
// -----------------------------------------------------

function createCategoryButtons() {

    categoryButtonsContainer.innerHTML = "";

    // ALL BUTTON

    const allButton = document.createElement("button");

    allButton.classList.add("category-btn", "active");

    allButton.dataset.category = "all";

    allButton.textContent = "All";

    categoryButtonsContainer.appendChild(allButton);


    // GET UNIQUE CATEGORIES

    const categories = [];

    menuData.forEach(function(item) {

        if (
            item.category &&
            !categories.includes(item.category)
        ) {
            categories.push(item.category);
        }

    });


    // CREATE CATEGORY BUTTONS

    categories.forEach(function(category) {

        const button = document.createElement("button");

        button.classList.add("category-btn");

        button.dataset.category = category;

        const icon =
            categoryIcons[category] || "🍽️";

        button.textContent =
            icon + " " + category;

        categoryButtonsContainer.appendChild(button);

    });


    // BUTTON EVENTS

    const categoryButtons =
        document.querySelectorAll(".category-btn");


    categoryButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            selectedCategory =
                button.dataset.category;


            categoryButtons.forEach(function(btn) {

                btn.classList.remove("active");

            });


            button.classList.add("active");

            displayMenu();

        });

    });

}


// -----------------------------------------------------
// 9. DISPLAY MENU
// -----------------------------------------------------

function displayMenu() {

    menuContainer.innerHTML = "";

    const searchText =
        searchInput.value.toLowerCase().trim();


    // FILTER ITEMS

    const filteredItems =
        menuData.filter(function(item) {

            const categoryMatches =
                selectedCategory === "all" ||
                item.category === selectedCategory;


            const nameMatches =
                item.item_name &&
                item.item_name
                    .toLowerCase()
                    .includes(searchText);


            const descriptionMatches =
                item.description &&
                item.description
                    .toLowerCase()
                    .includes(searchText);


            const categorySearchMatches =
                item.category &&
                item.category
                    .toLowerCase()
                    .includes(searchText);


            const searchMatches =
                searchText === "" ||
                nameMatches ||
                descriptionMatches ||
                categorySearchMatches;


            return categoryMatches && searchMatches;

        });


    // -------------------------------------------------
    // NO RESULTS
    // -------------------------------------------------

    if (filteredItems.length === 0) {

        noResults.style.display = "block";

        resultSummary.textContent =
            "No menu items found.";

        return;
    }


    noResults.style.display = "none";


    // -------------------------------------------------
    // GROUP ITEMS BY CATEGORY
    // -------------------------------------------------

    const groupedMenu = {};


    filteredItems.forEach(function(item) {

        if (!groupedMenu[item.category]) {

            groupedMenu[item.category] = [];

        }

        groupedMenu[item.category].push(item);

    });


    // -------------------------------------------------
    // CREATE MENU BOXES
    // -------------------------------------------------

    Object.keys(groupedMenu).forEach(function(category) {

        const menuBox =
            document.createElement("div");

        menuBox.classList.add("menu-box");


        // CATEGORY HEADING

        const heading =
            document.createElement("h2");

        const icon =
            categoryIcons[category] || "🍽️";

        heading.textContent =
            icon + " " + category;

        menuBox.appendChild(heading);


        // ITEMS CONTAINER

        const itemsContainer =
            document.createElement("div");

        itemsContainer.classList.add("menu-items");


        // CREATE EACH ITEM

        groupedMenu[category].forEach(function(item) {

            const menuItem =
                document.createElement("div");

            menuItem.classList.add("menu-item");


            // ITEM INFORMATION

            const itemInfo =
                document.createElement("div");

            itemInfo.classList.add("item-info");


            const itemName =
                document.createElement("span");

            itemName.textContent =
                item.item_name;

            itemInfo.appendChild(itemName);


            // DESCRIPTION

            if (item.description) {

                const description =
                    document.createElement("small");

                description.textContent =
                    item.description;

                itemInfo.appendChild(description);

            }


            // RIGHT SIDE

            const itemRight =
                document.createElement("div");

            itemRight.classList.add("item-right");


            // PRICE

            const price =
                document.createElement("strong");

            price.textContent =
                "₹" + Number(item.price);

            itemRight.appendChild(price);


            // AVAILABILITY

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


            // ADD EVERYTHING

            menuItem.appendChild(itemInfo);

            menuItem.appendChild(itemRight);

            itemsContainer.appendChild(menuItem);

        });


        menuBox.appendChild(itemsContainer);

        menuContainer.appendChild(menuBox);

    });


    // -------------------------------------------------
    // RESULT COUNT
    // -------------------------------------------------

    resultSummary.textContent =
        filteredItems.length +
        " menu item" +
        (filteredItems.length === 1
            ? ""
            : "s") +
        " found.";

}


// -----------------------------------------------------
// 10. SEARCH
// -----------------------------------------------------

searchInput.addEventListener(
    "input",
    function() {

        displayMenu();

    }
);


// -----------------------------------------------------
// 11. CLEAR FILTERS
// -----------------------------------------------------

clearFilters.addEventListener(
    "click",
    function() {

        searchInput.value = "";

        selectedCategory = "all";


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


        displayMenu();

    }
);


// -----------------------------------------------------
// 12. ERROR MESSAGE
// -----------------------------------------------------

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


// -----------------------------------------------------
// 13. START
// -----------------------------------------------------

loadMenu();