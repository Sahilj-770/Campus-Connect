console.log("Campus Bites JavaScript loaded");

const urlParams = new URLSearchParams(window.location.search);

const selectedCanteen = urlParams.get("canteen");

console.log(selectedCanteen);

const canteenTitle = document.querySelector("#canteenTitle");

if (selectedCanteen === "cafeteria") {

    canteenTitle.textContent = "Cafeteria Menu";

} else if (selectedCanteen === "timeless") {

    canteenTitle.textContent = "Timeless Menu";

} else {
    canteenTitle.textContent = "Nescafe Menu";
}


const canteenMenus = {

    cafeteria: {

        "Breakfast": [
            { name: "Poha", price: 25 },
            { name: "Upma", price: 25 },
            { name: "Idli Sambar", price: 40 },
            { name: "Medu Vada", price: 50 },
            { name: "Misal Pav", price: 60 },
            { name: "Pav Bhaji", price: 60 },
            { name: "Batata Vada", price: 40 },
            { name: "Chole Bhature", price: 50 }
        ],

        "South Indian": [
            { name: "Plain Dosa", price: 50 },
            { name: "Masala Dosa", price: 55 },
            { name: "Cut Dosa", price: 60 },
            { name: "Butter Dosa", price: 65 },
            { name: "Paneer Dosa", price: 85 },
            { name: "Cheese Dosa", price: 85 },
            { name: "Mysore Dosa", price: 75 },
            { name: "Plain Uttapa", price: 55 }
        ],

        "Chinese": [
            { name: "Veg Fried Rice", price: 85 },
            { name: "Veg Sez. Rice", price: 95 },
            { name: "Veg Triple Rice", price: 130 },
            { name: "Veg Hakka Noodles", price: 95 },
            { name: "Veg Sez. Noodles", price: 110 },
            { name: "Veg Triple Noodles", price: 120 }
        ],

        "Chapati / Paratha": [
            { name: "Chapati", price: 10 },
            { name: "Lachha Paratha", price: 55 },
            { name: "Gobi Paratha", price: 55 },
            { name: "Aloo Paratha", price: 65 },
            { name: "Aloo Pyaz Paratha", price: 70 },
            { name: "Paneer Paratha", price: 70 },
            { name: "Veg Paratha", price: 70 }
        ],

        "Rice": [
            { name: "Veg Biryani", price: 100 },
            { name: "Veg Pulao", price: 90 },
            { name: "Paneer Pulao", price: 110 },
            { name: "Steam Rice", price: 50 },
            { name: "Jeera Rice", price: 60 },
            { name: "Dal Khichdi", price: 90 },
            { name: "Curd Rice", price: 70 }
        ],

        "Sandwich": [
            { name: "Veg Sandwich", price: 40 },
            { name: "Veg Cheese Sandwich", price: 50 },
            { name: "Paneer Sandwich", price: 60 },
            { name: "Paneer Cheese Sandwich", price: 70 },
            { name: "Corn Cheese Sandwich", price: 60 },
            { name: "Veg Club Sandwich", price: 70 },
            { name: "Bombay Masala", price: 50 }
        ],

        "Maggi": [
            { name: "Plain Maggi", price: 40 },
            { name: "Masala Maggi", price: 50 },
            { name: "Cheese Maggi", price: 60 },
            { name: "Butter Maggi", price: 60 },
            { name: "Paneer Maggi", price: 60 },
            { name: "Peri Peri Maggi", price: 60 }
        ],

        "Beverages": [
            { name: "Cold Coffee", price: 60 },
            { name: "Cold Bournvita", price: 70 },
            { name: "Cold Chocolate", price: 60 },
            { name: "Tea", price: 20 },
            { name: "Black Tea", price: 20 },
            { name: "Green Tea", price: 20 }
        ]

    }

};

const searchInput = document.querySelector("#menuSearch");

const menuBoxes = document.querySelectorAll(".menu-box");


const categoryButtons = document.querySelectorAll(".category-btn");

const clearFilters = document.querySelector("#clearFilters");


let selectedCategory = "all";


function filterMenu() {

    const searchText = searchInput.value.toLowerCase().trim();


    menuBoxes.forEach(function (box) {

        const boxCategory = box.dataset.category;


        const items = box.querySelectorAll(".menu-item");


        let categoryMatches = false;

        let itemMatches = false;


        if (
            selectedCategory === "all" ||
            boxCategory === selectedCategory
        ) {

            categoryMatches = true;

        }


        items.forEach(function (item) {

            const itemName = item
                .querySelector("span")
                .textContent
                .toLowerCase();


            if (itemName.includes(searchText)) {

                item.style.display = "flex";

                itemMatches = true;

            } else {

                item.style.display = "none";

            }

        });


        if (categoryMatches && (itemMatches || searchText === "")) {

            box.style.display = "block";

        } else {

            box.style.display = "none";

        }

    });

}


searchInput.addEventListener("input", function () {

    filterMenu();

});


categoryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        selectedCategory = button.dataset.category;


        categoryButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        filterMenu();

    });

});

clearFilters.addEventListener("click", function () {

    searchInput.value = "";

    selectedCategory = "all";

    categoryButtons.forEach(function (button) {

        button.classList.remove("active");

    });

    categoryButtons[0].classList.add("active");

    filterMenu();

});

// Run the filter once when the page first loads
filterMenu();