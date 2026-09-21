<?php

/*
 * CampusConnect shared PHP database connection.
 *
 * Local defaults match the working database.php supplied for this project.
 * Deployment environments can override them with environment variables.
 */

$host = getenv("DB_HOST") ?: "localhost";
$username = getenv("DB_USER") ?: "root";
$password = getenv("DB_PASSWORD") ?: "";
$database = getenv("DB_NAME") ?: "campusconnect";
$port = (int) (getenv("DB_PORT") ?: 3307);

$conn = new mysqli(
    $host,
    $username,
    $password,
    $database,
    $port
);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");
?>
