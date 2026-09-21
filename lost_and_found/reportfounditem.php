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

// Optional image upload from the existing report form.
$image_path = "";

if (
    isset($_FILES["item_image"]) &&
    $_FILES["item_image"]["error"] === UPLOAD_ERR_OK
) {
    $image_name = $_FILES["item_image"]["name"];
    $image_tmp = $_FILES["item_image"]["tmp_name"];
    $image_size = $_FILES["item_image"]["size"];

    $allowed_types = ["jpg", "jpeg", "png", "gif", "webp"];
    $file_extension = strtolower(pathinfo($image_name, PATHINFO_EXTENSION));

    if (!in_array($file_extension, $allowed_types, true)) {
        die("Only JPG, JPEG, PNG, GIF and WEBP images are allowed.");
    }

    if ($image_size > 5 * 1024 * 1024) {
        die("Image size must be less than 5 MB.");
    }

    $upload_folder = "uploads/items/";

    if (!is_dir($upload_folder) && !mkdir($upload_folder, 0777, true)) {
        die("Unable to create image upload folder.");
    }

    $new_image_name = time() . "_" . uniqid() . "." . $file_extension;
    $image_full_path = $upload_folder . $new_image_name;

    if (!move_uploaded_file($image_tmp, $image_full_path)) {
        die("Failed to upload image.");
    }

    $image_path = $image_full_path;
}



// Insert into found_items table
$sql = "INSERT INTO found_items
        (
            roll_number,
            item_name,
            location,
            status,
            person_name,
            contact_number,
            description,
            image
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";


$stmt = $conn->prepare($sql);


if (!$stmt) {
    die("Database Error: " . $conn->error);
}


$stmt->bind_param(
    "ssssssss",
    $roll_number,
    $item_name,
    $location,
    $status,
    $person_name,
    $contact_number,
    $description,
    $image_path
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