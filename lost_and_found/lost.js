// ===============================
// BROWSE / SEARCH
// ===============================

let browseSearch = document.getElementById("browseSearch");
let statusFilter = document.getElementById("statusFilter");
let browseButton = document.getElementById("browseButton");

if (browseButton) {
    browseButton.addEventListener("click", function () {

        let searchValue = "";

        if (browseSearch) {
            searchValue = browseSearch.value.toLowerCase().trim();
        }

        let selectedStatus = "all";

        if (statusFilter) {
            selectedStatus = statusFilter.value.toLowerCase();
        }

        let cards = document.querySelectorAll(".item-card");

        cards.forEach(function (card) {

            let cardText = card.innerText.toLowerCase();

            let cardStatus = card.getAttribute("data-status");

            let matchesSearch =
                searchValue === "" ||
                cardText.includes(searchValue);

            let matchesStatus =
                selectedStatus === "all" ||
                cardStatus === selectedStatus;

            if (matchesSearch && matchesStatus) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });
    });
}


// ===============================
// VIEW DETAILS BUTTON
// ===============================

let detailButtons = document.querySelectorAll(".view-details");

detailButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        let name = button.getAttribute("data-name") || "";
        let status = button.getAttribute("data-status") || "";
        let location = button.getAttribute("data-location") || "";

        alert(
            "Item Details\n\n" +
            "Item: " + name + "\n" +
            "Status: " + status + "\n" +
            "Location: " + location
        );

    });

});


// ===============================
// REPORT FORM → EXPRESS BACKEND
// ===============================

let reportForm = document.querySelector(".report-form form");

if (reportForm) {

    reportForm.addEventListener("submit", async function (event) {

        // Stop the old PHP form submission
        event.preventDefault();

        let itemNameElement =
            document.getElementById("itemName");

        let itemStatusElement =
            document.getElementById("itemStatus");

        let itemLocationElement =
            document.getElementById("itemLocation");

        let itemDescriptionElement =
            document.getElementById("itemDescription");


        let item_name =
            itemNameElement ?
            itemNameElement.value.trim() :
            "";

        let status =
            itemStatusElement ?
            itemStatusElement.value :
            "";

        let location =
            itemLocationElement ?
            itemLocationElement.value.trim() :
            "";

        let description =
            itemDescriptionElement ?
            itemDescriptionElement.value.trim() :
            "";


        // Check required fields

        if (
            item_name === "" ||
            status === "" ||
            location === "" ||
            description === ""
        ) {

            alert("Please fill in all the required fields.");

            return;

        }


        try {

            // Send data to Express backend

            const response = await fetch(
                "http://localhost:3000/api/lost-found",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        item_name: item_name,
                        status: status,
                        location: location,
                        description: description

                    })

                }
            );


            const data = await response.json();


            // Backend error

            if (!response.ok) {

                alert(
                    data.error ||
                    "Could not report item."
                );

                return;

            }


            // Successful submission

            alert(
                "Item reported successfully!"
            );


            // Clear form

            reportForm.reset();


        } catch (error) {

            console.log(
                "Report item error:",
                error
            );

            alert(
                "Could not connect to the Campus Connect server."
            );

        }

    });

}


// ===============================
// LOAD LOST ITEMS FROM EXPRESS
// ===============================

async function loadLostItems() {

    const itemsGrid =
        document.querySelector(".items-grid");

    if (!itemsGrid) {
        return;
    }


    // Only run this on the Lost Items page
    // when the page contains the loading message.

    if (
        !itemsGrid.innerText
            .toLowerCase()
            .includes("loading")
    ) {
        return;
    }


    try {

        const response = await fetch(
            "http://localhost:3000/api/lost-found/lost"
        );


        const items = await response.json();


        if (!response.ok) {

            throw new Error(
                items.error ||
                "Could not load lost items."
            );

        }


        // Clear loading message

        itemsGrid.innerHTML = "";


        // No items

        if (items.length === 0) {

            itemsGrid.innerHTML = `
                <div class="no-items">
                    <h3>No lost items reported yet.</h3>
                    <p>Be the first to report a lost item.</p>
                </div>
            `;

            return;

        }


        // Create cards

        items.forEach(function (item) {

            const card =
                document.createElement("div");

            card.className = "item-card";

            card.setAttribute(
                "data-status",
                "lost"
            );


            card.innerHTML = `

                <div class="item-image blue-image">
                    📦
                </div>

                <div class="item-content">

                    <div class="item-top">

                        <span class="status lost">
                            LOST
                        </span>

                        <span class="date">
                            Reported
                        </span>

                    </div>

                    <h3>
                        ${escapeHTML(item.item_name)}
                    </h3>

                    <p>
                        ${escapeHTML(item.description || "")}
                    </p>

                    <div class="item-location">
                        📍
                        ${escapeHTML(item.location || "")}
                    </div>

                </div>

            `;


            itemsGrid.appendChild(card);

        });


    } catch (error) {

        console.log(
            "Lost items loading error:",
            error
        );


        itemsGrid.innerHTML = `

            <div class="no-items">

                <h3>
                    Could not load lost items.
                </h3>

                <p>
                    Please make sure the Campus Connect
                    server is running.
                </p>

            </div>

        `;

    }

}


// ===============================
// LOAD FOUND ITEMS FROM EXPRESS
// ===============================

async function loadFoundItems() {

    const itemsGrid =
        document.querySelector(".items-grid");

    if (!itemsGrid) {
        return;
    }


    // Only run when page contains loading message

    if (
        !itemsGrid.innerText
            .toLowerCase()
            .includes("loading")
    ) {
        return;
    }


    // Don't accidentally load found items
    // on the lost page.

    const heading =
        document.body.innerText.toLowerCase();

    if (!heading.includes("found items")) {
        return;
    }


    try {

        const response = await fetch(
            "http://localhost:3000/api/lost-found/found"
        );


        const items = await response.json();


        if (!response.ok) {

            throw new Error(
                items.error ||
                "Could not load found items."
            );

        }


        itemsGrid.innerHTML = "";


        if (items.length === 0) {

            itemsGrid.innerHTML = `

                <div class="no-items">

                    <h3>
                        No found items reported yet.
                    </h3>

                    <p>
                        Be the first to report a found item.
                    </p>

                </div>

            `;

            return;

        }


        items.forEach(function (item) {

            const card =
                document.createElement("div");

            card.className = "item-card";

            card.setAttribute(
                "data-status",
                "found"
            );


            card.innerHTML = `

                <div class="item-image orange-image">
                    📦
                </div>

                <div class="item-content">

                    <div class="item-top">

                        <span class="status found">
                            FOUND
                        </span>

                        <span class="date">
                            Reported
                        </span>

                    </div>

                    <h3>
                        ${escapeHTML(item.item_name)}
                    </h3>

                    <p>
                        ${escapeHTML(item.description || "")}
                    </p>

                    <div class="item-location">
                        📍
                        ${escapeHTML(item.location || "")}
                    </div>

                </div>

            `;


            itemsGrid.appendChild(card);

        });


    } catch (error) {

        console.log(
            "Found items loading error:",
            error
        );


        itemsGrid.innerHTML = `

            <div class="no-items">

                <h3>
                    Could not load found items.
                </h3>

                <p>
                    Please make sure the Campus Connect
                    server is running.
                </p>

            </div>

        `;

    }

}


// ===============================
// HTML SAFETY FUNCTION
// ===============================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ===============================
// START DATABASE LOADING
// ===============================

loadLostItems();

loadFoundItems();