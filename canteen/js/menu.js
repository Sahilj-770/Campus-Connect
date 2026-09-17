// =====================================================
// CAMPUS BITES - BROWSE CUISINE
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const menuContainer =
    document.querySelector("#menuContainer");

const searchInput =
    document.querySelector("#menuSearch");

const categoryButtonsContainer =
    document.querySelector("#categoryButtons");

const clearFilters =
    document.querySelector("#clearFilters");

const noResults =
    document.querySelector("#noResults");

const resultSummary =
    document.querySelector("#resultSummary");

const canteenTitle =
    document.querySelector("#canteenTitle");


// =====================================================
// DATA
// =====================================================

let allMenuItems = [];

let selectedCanteen = "all";

let selectedCategory = "all";


// =====================================================
// FOOD IMAGES
// =====================================================

const foodImages = {

    "Poha":
        "images/poha.jpg",

    "Idli Sambar":
        "images/idli-sambar.jpg",

    "Upma":
        "images/upma.jpg",

    "Veg Burger":
        "images/veg-burger.jpg",

    "White Sauce Pasta":
        "images/white-sauce-pasta.jpg",

    "Cold Coffee":
        "images/cold-coffee.jpg",

    "North Indian Thali":
        "images/thali.jpg",

    "Maggi":
        "images/maggi.jpg",

    "Veg Sandwich":
        "images/veg-sandwich.jpg"

};


// =====================================================
// CANTEEN NAMES
// =====================================================

const canteenNames = {

    cafeteria: "Cafeteria",

    timeless: "Timeless",

    nescafe: "Nescafe"

};


// =====================================================
// LOAD ALL MENUS
// =====================================================

function loadAllMenus() {

    const canteens = [
        "cafeteria",
        "timeless",
        "nescafe"
    ];


    const requests = canteens.map(function(canteen) {

        return fetch(
            "http://localhost:3000/api/menu/" + canteen
        )

        .then(function(response) {

            if (!response.ok) {

                throw new Error(
                    "Could not load " + canteen
                );

            }

            return response.json();

        })

        .then(function(data) {

            return data.map(function(item) {

                return {

                    ...item,

                    canteen: canteen

                };

            });

        });

    });


    Promise.all(requests)

        .then(function(results) {

            allMenuItems = results.flat();

            console.log(
                "All menu items:",
                allMenuItems
            );


            createCategoryButtons();

            displayMenu();

        })


        .catch(function(error) {

            console.log(
                "Menu loading error:",
                error
            );


            showError(
                "Unable to load menu. Make sure the backend is running."
            );

        });

}


// =====================================================
// CREATE CATEGORY BUTTONS
// =====================================================

function createCategoryButtons() {

    categoryButtonsContainer.innerHTML = "";


    const categories = [];


    allMenuItems.forEach(function(item) {

        if (
            item.category &&
            !categories.includes(item.category)
        ) {

            categories.push(item.category);

        }

    });


    categories.forEach(function(category) {

        const button =
            document.createElement("button");


        button.classList.add(
            "category-btn"
        );


        button.dataset.category =
            category;


        button.textContent =
            category;


        categoryButtonsContainer.appendChild(
            button
        );


        button.addEventListener(
            "click",
            function() {

                selectedCategory =
                    category;


                updateCategoryButtons();

                displayMenu();

            }
        );

    });

}


// =====================================================
// CATEGORY BUTTON STATE
// =====================================================

function updateCategoryButtons() {

    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(function(button) {

        button.classList.remove("active");

    });

}


// =====================================================
// DISPLAY MENU
// =====================================================

function displayMenu() {

    menuContainer.innerHTML = "";


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredItems =
        allMenuItems.filter(function(item) {


            const matchesCanteen =
                selectedCanteen === "all" ||
                item.canteen === selectedCanteen;


            const matchesCategory =
                selectedCategory === "all" ||
                item.category === selectedCategory;


            const matchesSearch =
                searchText === "" ||

                item.item_name
                    .toLowerCase()
                    .includes(searchText) ||

                (item.description &&
                    item.description
                        .toLowerCase()
                        .includes(searchText)) ||

                (item.category &&
                    item.category
                        .toLowerCase()
                        .includes(searchText));


            return (
                matchesCanteen &&
                matchesCategory &&
                matchesSearch
            );

        });


    resultSummary.textContent =
        filteredItems.length +
        " menu items found";


    if (filteredItems.length === 0) {

        noResults.style.display =
            "block";

        return;

    }


    noResults.style.display =
        "none";


    // Group by category

    const groupedMenu = {};


    filteredItems.forEach(function(item) {

        if (!groupedMenu[item.category]) {

            groupedMenu[item.category] = [];

        }


        groupedMenu[item.category].push(
            item
        );

    });


    Object.keys(groupedMenu)
        .forEach(function(category) {

            createCategorySection(
                category,
                groupedMenu[category]
            );

        });

}


// =====================================================
// CREATE CATEGORY SECTION
// =====================================================

function createCategorySection(
    category,
    items
) {

    const menuBox =
        document.createElement("div");


    menuBox.classList.add(
        "menu-box"
    );


    const heading =
        document.createElement("h2");


    heading.textContent =
        "🍽️ " + category;


    menuBox.appendChild(
        heading
    );


    const itemsContainer =
        document.createElement("div");


    itemsContainer.classList.add(
        "menu-items"
    );


    items.forEach(function(item) {

        const card =
            createFoodCard(item);


        itemsContainer.appendChild(
            card
        );

    });


    menuBox.appendChild(
        itemsContainer
    );


    menuContainer.appendChild(
        menuBox
    );

}


// =====================================================
// CREATE FOOD CARD
// =====================================================

function createFoodCard(item) {

    const card =
        document.createElement("div");


    card.classList.add(
        "menu-item"
    );


    // IMAGE

    let imageHTML = "";


    if (foodImages[item.item_name]) {

        imageHTML = `
            <img
                src="${foodImages[item.item_name]}"
                alt="${item.item_name}"
                class="food-image"
            >
        `;

    } else {

        imageHTML = `
            <div class="food-image-placeholder">
                🍽️
            </div>
        `;

    }


    // DETAILS

    const details =
        document.createElement("div");


    details.classList.add(
        "item-details"
    );


    details.innerHTML = `

        <span class="canteen-badge">
            ${canteenNames[item.canteen]}
        </span>

        <h3>
            ${item.item_name}
        </h3>

        <p class="item-description">
            ${item.description || "Delicious campus favourite."}
        </p>

        <div class="item-bottom">

            <strong class="item-price">
                ₹${Number(item.price)}
            </strong>

            <span class="availability ${
                item.availability &&
                item.availability
                    .toLowerCase()
                    .includes("not")
                    ? "unavailable"
                    : ""
            }">

                ${item.availability || "Available"}

            </span>

            <button
                class="add-cart"
                type="button">

                🛒 &nbsp; Add to Cart

            </button>

        </div>

    `;


    card.innerHTML =
        imageHTML;


    card.appendChild(
        details
    );


    return card;

}


// =====================================================
// CANTEEN FILTER
// =====================================================

const canteenFilters =
    document.querySelectorAll(
        ".canteen-filter"
    );


canteenFilters.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            selectedCanteen =
                button.dataset.canteen;


            canteenFilters.forEach(
                function(btn) {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            updateTitle();

            displayMenu();

        }
    );

});


// =====================================================
// UPDATE TITLE
// =====================================================

function updateTitle() {

    if (selectedCanteen === "all") {

        canteenTitle.innerHTML =
            'Showing all items from <span>3 canteens</span>';

    } else {

        canteenTitle.innerHTML =
            "Showing items from <span>" +
            canteenNames[selectedCanteen] +
            "</span>";

    }

}


// =====================================================
// SEARCH
// =====================================================

searchInput.addEventListener(
    "input",
    function() {

        displayMenu();

    }
);


// =====================================================
// CLEAR FILTERS
// =====================================================

clearFilters.addEventListener(
    "click",
    function() {

        searchInput.value = "";

        selectedCanteen = "all";

        selectedCategory = "all";


        canteenFilters.forEach(
            function(button) {

                button.classList.remove(
                    "active"
                );

            }
        );


        document
            .querySelector(
                '.canteen-filter[data-canteen="all"]'
            )
            .classList.add("active");


        updateTitle();

        displayMenu();

    }
);


// =====================================================
// ERROR
// =====================================================

function showError(message) {

    menuContainer.innerHTML = "";

    noResults.style.display =
        "block";


    noResults.querySelector(
        "h2"
    ).textContent =
        "Menu unavailable";


    noResults.querySelector(
        "p"
    ).textContent =
        message;

}


// =====================================================
// START
// =====================================================

loadAllMenus();