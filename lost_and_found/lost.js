let searchInput = document.getElementById("browseSearch");
let statusFilter = document.getElementById("statusFilter");
let browseButton = document.getElementById("browseButton");

if (browseButton) {
    browseButton.addEventListener("click", function() {

        let searchText = searchInput.value.toLowerCase();
        let selectedStatus = statusFilter.value;
        let items = document.querySelectorAll(".item-card");

        items.forEach(function(item) {

            let itemName = item.querySelector("h3").textContent.toLowerCase();
            let itemStatus = item.getAttribute("data-status");

            if (
                itemName.includes(searchText) &&
                (selectedStatus === "all" || selectedStatus === itemStatus)
            ) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }

        });

    });
}

let detailButtons = document.querySelectorAll(".view-details");

detailButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        let name = button.getAttribute("data-name");
        let status = button.getAttribute("data-status");
        let location = button.getAttribute("data-location");

        alert(
            "Item: " + name +
            "\nStatus: " + status +
            "\nLocation: " + location
        );

    });

});
let submitReport = document.getElementById("submitReport");

if (submitReport) {
    submitReport.addEventListener("click", function() {

    let name = document.getElementById("itemName").value;
    let status = document.getElementById("itemStatus").value;
    let location = document.getElementById("itemLocation").value;
    let description = document.getElementById("itemDescription").value;

    if (name === "" || location === "" || description === "") {
        alert("Please fill all the details.");
        return;
    }

    alert(
        "Report Submitted!\n\n" +
        "Item: " + name +
        "\nStatus: " + status +
        "\nLocation: " + location +
        "\nDescription: " + description
    );

});
}