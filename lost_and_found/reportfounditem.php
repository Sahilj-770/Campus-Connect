<?php

require_once "../config/database.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request.");
}


// Get data from form
$item_name = trim($_POST["item_name"] ?? "");
$location = trim($_POST["location"] ?? "");
$description = trim($_POST["description"] ?? "");


// Check required fields
if (
    $item_name === "" ||
    $location === "" ||
    $description === ""
) {
    die("Please fill in all the required fields.");
}


// Values not collected by your current frontend
$person_name = "Campus Student";
$roll_number = "N/A";
$contact_number = "N/A";
$status = "Found";


// Insert into found_items table
$sql = "INSERT INTO found_items
        (
            roll_number,
            item_name,
            location,
            status,
            person_name,
            contact_number,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)";


$stmt = $conn->prepare($sql);


if (!$stmt) {
    die("Database Error: " . $conn->error);
}


$stmt->bind_param(
    "sssssss",
    $roll_number,
    $item_name,
    $location,
    $status,
    $person_name,
    $contact_number,
    $description
);


if ($stmt->execute()) {

    $stmt->close();
    $conn->close();

    header("Location: found-items.php?success=1");
    exit();

} else {

    die("Database Error: " . $stmt->error);

}

?>