
const canteenCards =
    document.querySelectorAll(".canteen-card");

const canteenStatus =
    document.querySelector("#canteenStatus");


canteenCards.forEach(function (card) {

    card.addEventListener("click", function (event) {

        console.log(
            "Clicked element:",
            event.target
        );

        const canteenName =
            card.dataset.canteen;



        console.log(
            "Selected canteen:",
            canteenName
        );

        card.classList.add("selected");


        const displayName =
            canteenName.charAt(0).toUpperCase()
            + canteenName.slice(1);

        canteenStatus.textContent =
            `Opening ${displayName} Menu...`;


        setTimeout(function () {

            window.location.href =
                `menu.html?canteen=${canteenName}`;


        }, 500);

    });

});

const canteenData = {

    cafeteria: {
        name: "Cafeteria",
        description: "Fresh meals, snacks and beverages for students.",
        categories: 8,
        timing: "8:00 AM – 8:00 PM",
        icon: "🍽️"
    },

    timeless: {
        name: "Timeless",
        description: "A variety of quick meals and refreshments.",
        categories: 6,
        timing: "9:00 AM – 7:00 PM",
        icon: "🥪"
    },

    nescafe: {
        name: "Nescafe",
        description: "Coffee, beverages and quick snacks.",
        categories: 5,
        timing: "8:30 AM – 8:30 PM",
        icon: "☕"
    }

};

canteenCards.forEach(function (card) {

    const canteenName = card.dataset.canteen;

    const data = canteenData[canteenName];

    card.innerHTML = `
        <div class="canteen-icon">
            ${data.icon}
        </div>

        <h3>${data.name}</h3>

        <p>${data.description}</p>

        <span>${data.categories} categories</span>

        <small>${data.timing}</small>

        <div class="view-menu">
            View Menu →
                </div>
    `;

});