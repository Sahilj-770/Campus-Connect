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
// REPORT FORM
// ===============================
//
// Lost  → reportlostitem.php → lost_items
// Found → reportfounditem.php → found_items
//

let reportForm = document.querySelector(".report-form form");
let itemStatus = document.getElementById("itemStatus");

if (reportForm && itemStatus) {

    reportForm.addEventListener("submit", function () {

        if (itemStatus.value === "found") {

            reportForm.action = "reportfounditem.php";

        } else {

            reportForm.action = "reportlostitem.php";

        }

    });

}