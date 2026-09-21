<?php

require_once "../config/database.php";


/* =====================================================
   ONLY ACCEPT POST REQUEST
   ===================================================== */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request.");
}


/* =====================================================
   GET FORM DATA
   ===================================================== */

$item_name = trim($_POST["item_name"] ?? "");
$status = trim($_POST["status"] ?? "");
$location = trim($_POST["location"] ?? "");
$description = trim($_POST["description"] ?? "");


/* =====================================================
   CHECK REQUIRED FIELDS
   ===================================================== */

if (
    $item_name === "" ||
    $status === "" ||
    $location === "" ||
    $description === ""
) {
    die("Please fill in all the required fields.");
}


/* =====================================================
   CHECK STATUS
   ===================================================== */

if ($status !== "lost" && $status !== "found") {
    die("Invalid item status.");
}


/* =====================================================
   DEFAULT PERSON DETAILS
   ===================================================== */

$person_name = "Campus Student";
$roll_number = "N/A";
$contact_number = "N/A";


/* =====================================================
   IMAGE UPLOAD
   ===================================================== */

$image_path = "";


if (
    isset($_FILES["item_image"]) &&
    $_FILES["item_image"]["error"] === UPLOAD_ERR_OK
) {

    $image_name = $_FILES["item_image"]["name"];
    $image_tmp = $_FILES["item_image"]["tmp_name"];
    $image_size = $_FILES["item_image"]["size"];


    /* ---------------------------------------------
       CHECK IMAGE TYPE
       --------------------------------------------- */

    $allowed_types = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp"
    ];


    $file_extension = strtolower(
        pathinfo($image_name, PATHINFO_EXTENSION)
    );


    if (!in_array($file_extension, $allowed_types)) {
        die("Only JPG, JPEG, PNG, GIF and WEBP images are allowed.");
    }


    /* ---------------------------------------------
       CHECK FILE SIZE
       Maximum = 5 MB
       --------------------------------------------- */

    if ($image_size > 5 * 1024 * 1024) {
        die("Image size must be less than 5 MB.");
    }


    /* ---------------------------------------------
       CREATE UPLOAD FOLDER
       --------------------------------------------- */

    $upload_folder = "uploads/items/";


    if (!is_dir($upload_folder)) {

        if (!mkdir($upload_folder, 0777, true)) {
            die("Unable to create image upload folder.");
        }

    }


    /* ---------------------------------------------
       CREATE UNIQUE IMAGE NAME
       --------------------------------------------- */

    $new_image_name =
        time() . "_" .
        uniqid() . "." .
        $file_extension;


    $image_full_path =
        $upload_folder . $new_image_name;


    /* ---------------------------------------------
       MOVE IMAGE
       --------------------------------------------- */

    if (!move_uploaded_file(
        $image_tmp,
        $image_full_path
    )) {

        die("Failed to upload image.");

    }


    /*
       This is the path stored in MySQL.

       Example:
       uploads/items/1758091234_abc123.jpg
    */

    $image_path = $image_full_path;
}


/* =====================================================
   IF ITEM IS LOST
   ===================================================== */

if ($status === "lost") {

    $sql = "INSERT INTO lost_items
            (
                person_name,
                roll_number,
                item_name,
                location,
                status,
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
        $person_name,
        $roll_number,
        $item_name,
        $location,
        $status,
        $contact_number,
        $description,
        $image_path
    );


    if (!$stmt->execute()) {

        die(
            "Database Error: " .
            $stmt->error
        );

    }


    $stmt->close();

}


/* =====================================================
   IF ITEM IS FOUND
   ===================================================== */

elseif ($status === "found") {

    $sql = "INSERT INTO found_items
            (
                person_name,
                roll_number,
                item_name,
                location,
                status,
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
        $person_name,
        $roll_number,
        $item_name,
        $location,
        $status,
        $contact_number,
        $description,
        $image_path
    );


    if (!$stmt->execute()) {

        die(
            "Database Error: " .
            $stmt->error
        );

    }


    $stmt->close();

}


/* =====================================================
   GO BACK TO HOME
   ===================================================== */

$conn->close();

header("Location: lost.php?success=1");
exit();

?>