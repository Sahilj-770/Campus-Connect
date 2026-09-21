<?php
require_once "../config/database.php";

$success = false;
$error = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $person_name = trim($_POST["person_name"] ?? "");
    $roll_number = trim($_POST["roll_number"] ?? "");
    $contact_number = trim($_POST["contact_number"] ?? "");
    $item_name = trim($_POST["item_name"] ?? "");
    $status = trim($_POST["status"] ?? "Lost");
    $location = trim($_POST["location"] ?? "");

    if ($person_name === "" || $roll_number === "" || $contact_number === "" ||
        $item_name === "" || $location === "") {

        $error = "Please fill all required fields.";

    } else {

        $sql = "INSERT INTO lost_items
                (person_name, roll_number, item_name, location, status, contact_number)
                VALUES (?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($sql);

        if ($stmt) {
            $stmt->bind_param(
                "ssssss",
                $person_name,
                $roll_number,
                $item_name,
                $location,
                $status,
                $contact_number
            );

            if ($stmt->execute()) {
                header("Location: lost.php?success=1#items");
                exit();
            } else {
                $error = "Database error: " . $stmt->error;
            }

            $stmt->close();

        } else {
            $error = "Database error: " . $conn->error;
        }
    }
}

if (isset($_GET["success"]) && $_GET["success"] == "1") {
    $success = true;
}

$recent_items = [];

$result = $conn->query(
    "SELECT person_name, roll_number, item_name, location, status, contact_number
     FROM lost_items
     WHERE LOWER(status) = 'lost'
     ORDER BY item_name ASC
     LIMIT 4"
);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $recent_items[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Campus Lost & Found</title>

    <link rel="stylesheet" href="lost.css">
</head>

<body>

    <!-- ================= NAVBAR ================= -->

    <header class="navbar">

    <div class="logo">
    <img src="logo.png" alt="Lost & Found Logo" class="logo-image">
    <span>Campus Lost & Found</span>
</div>
        

        <nav>
    <a href="#home">Home</a>
    <a href="lost-items.php">Lost Items</a>
    <a href="found-items.php">Found Items</a>
    <a href="browse.php">Browse Items</a>
</nav>
            
        
            
            
        

        <a href="#report" class="login-btn">Report Item →</a>

    </header>


    <!-- ================= HERO SECTION ================= -->

    <section class="hero" id="home">

        <div class="hero-text">

            <p class="small-heading">CAMPUS LOST & FOUND</p>

            <h1>
                Lost something?
                <span>Let's find it.</span>
            </h1>

            <p class="hero-description">
                A simple place for students to report lost items,
                post things they have found and reconnect belongings
                with their owners.
            </p>

            <div class="hero-buttons">

                <a href="#report" class="primary-btn">
                    Report an Item
                </a>

                <a href="#items" class="secondary-btn">
                    Browse Items
                </a>

            </div>

        </div>


        <div class="hero-box">

            <div class="search-box">

                <h3>Looking for something?</h3>

                <p>
                    Search through recently reported items.
                </p>

                <div class="search-bar">

                    <input
    type="text"
    id="searchInput"
    placeholder="Search for an item..."
>

<button id="searchButton">Search</button>
                    
                        
                    

                    

                </div>

            </div>

        </div>

    </section>



    <!-- ================= QUICK ACTIONS ================= -->

    <section class="quick-section">

        <div class="section-title">

            <p class="small-heading">GET STARTED</p>

            <h2>What would you like to do?</h2>

        </div>


        <div class="quick-cards">

            <div class="quick-card">

                <div class="quick-icon lost-icon">
                    🎒
                </div>

                <h3>I lost something</h3>

                <p>
                    Report an item you have lost around
                    the college campus.
                </p>

                <a href="#report">
                    Report Lost Item →
                </a>

            </div>


            <div class="quick-card">

                <div class="quick-icon found-icon">
                    ✓
                </div>

                <h3>I found something</h3>

                <p>
                    Help another student by reporting
                    an item you have found.
                </p>

                <a href="#report">
                    Report Found Item →
                </a>

            </div>


            <div class="quick-card">

                <div class="quick-icon search-icon">
                    🔍
                </div>

                <h3>I'm looking for an item</h3>

                <p>
                    Browse reported items and see if
                    something belongs to you.
                </p>

                <a href="#items">
                    View Lost & Found →
                </a>

            </div>

        </div>

    </section>



    <!-- ================= RECENT ITEMS ================= -->

    <section class="items-section" id="items">

        <div class="section-heading-row">

            <div>

                <p class="small-heading">RECENT REPORTS</p>

                <h2>Recently reported items</h2>

            </div>

            <a href="#items" class="view-all">
    View all →
</a>
                
           

        </div>


        <div class="item-grid">

            <?php if (count($recent_items) > 0): ?>

                <?php foreach ($recent_items as $item): ?>

                    <div class="item-card">

                        <div class="item-image orange-image">
                            🎒
                        </div>

                        <div class="item-content">

                            <div class="item-top">

                                <span class="status lost">
                                    <?php echo htmlspecialchars(strtoupper($item["status"])); ?>
                                </span>

                                <span class="date">
                                    Reported
                                </span>

                            </div>

                            <h3>
                                <?php echo htmlspecialchars($item["item_name"]); ?>
                            </h3>

                            <p>
                                Reported by
                                <?php echo htmlspecialchars($item["person_name"]); ?>
                                (<?php echo htmlspecialchars($item["roll_number"]); ?>)
                            </p>

                            <div class="item-location">
                                📍 <?php echo htmlspecialchars($item["location"]); ?>
                            </div>

                        </div>

                    </div>

                <?php endforeach; ?>

            <?php else: ?>

                <p>No lost items have been reported yet.</p>

            <?php endif; ?>

        </div>
    </section>



    <!-- ================= HOW IT WORKS ================= -->

    <section class="how-section" id="how-it-works">

        <div class="section-title">

            <p class="small-heading">SIMPLE PROCESS</p>

            <h2>How Campus Lost & Found works</h2>

            <p>
                Getting an item back doesn't have to be complicated.
            </p>

        </div>


        <div class="steps">


            <div class="step">

                <div class="step-number">
                    01
                </div>

                <h3>Report</h3>

                <p>
                    Submit details about the item you
                    lost or found.
                </p>

            </div>


            <div class="step">

                <div class="step-number">
                    02
                </div>

                <h3>Search</h3>

                <p>
                    Students can browse the reported
                    items on campus.
                </p>

            </div>


            <div class="step">

                <div class="step-number">
                    03
                </div>

                <h3>Match</h3>

                <p>
                    Compare the item details to find
                    a possible match.
                </p>

            </div>


            <div class="step">

                <div class="step-number">
                    04
                </div>

                <h3>Collect</h3>

                <p>
                    Contact the concerned person and
                    safely collect the item.
                </p>

            </div>

        </div>

    </section>



    <!-- ================= STATISTICS ================= -->

    <section class="stats-section">

        <div class="stat">

            <h2>120+</h2>

            <p>Items Reported</p>

        </div>


        <div class="stat">

            <h2>85+</h2>

            <p>Items Returned</p>

        </div>


        <div class="stat">

            <h2>60+</h2>

            <p>Active Students</p>

        </div>


        <div class="stat">

            <h2>24/7</h2>

            <p>Reporting Available</p>

        </div>

    </section>



    <!-- ================= REPORT SECTION ================= -->

    <section class="report-section" id="report">

    <div class="report-content">

        <p class="small-heading">REPORT AN ITEM</p>

        <h2>
            Report a lost or found item.
        </h2>

        <p>
            Enter the details below so other students
            can help return the item to its owner.
        </p>

    </div>


    <div class="report-form">

        <?php if ($success): ?>
            <p style="background:#e8f7e8; color:#176b2c; padding:14px; border-radius:10px; margin-bottom:15px;">
                Lost item reported successfully!
            </p>
        <?php endif; ?>

        <?php if ($error !== ""): ?>
            <p style="background:#fde8e8; color:#a51d1d; padding:14px; border-radius:10px; margin-bottom:15px;">
                <?php echo htmlspecialchars($error); ?>
            </p>
        <?php endif; ?>

        <form method="POST" action="lost.php#report">

            <input
                type="text"
                id="personName"
                name="person_name"
                placeholder="Your name"
                required
            >

            <input
                type="text"
                id="rollNumber"
                name="roll_number"
                placeholder="Roll number"
                required
            >

            <input
                type="text"
                id="contactNumber"
                name="contact_number"
                placeholder="Contact number"
                required
            >

            <input
                type="text"
                id="itemName"
                name="item_name"
                placeholder="Item name"
                required
            >

            <select id="itemStatus" name="status" required>
                <option value="Lost">I Lost This Item</option>
            </select>

            <input
                type="text"
                id="itemLocation"
                name="location"
                placeholder="Location"
                required
            >

            <textarea
                id="itemDescription"
                name="description"
                placeholder="Describe the item"
            ></textarea>

            <button class="primary-btn" type="submit">
                Submit Report
            </button>

        </form>

    </div>
   



    <!-- ================= FOOTER ================= -->

    <footer id="contact">

        <div class="footer-main">

            <div class="footer-about">

                <h3>Campus Lost & Found</h3>

                <p>
                    A student-friendly platform for
                    managing lost and found items
                    within the campus.
                </p>

            </div>


            <div class="footer-links">

                <h4>Quick Links</h4>

                <a href="#home">Home</a>
                <a href="#items">Lost Items</a>
                <a href="#how-it-works">How It Works</a>

            </div>


            <div class="footer-links">

                <h4>Contact</h4>

                <p>College Campus</p>
                <p>Student Support Desk</p>
                <p>campus@example.com</p>

            </div>

        </div>


        <div class="footer-bottom">

            <p>
                © 2026 Campus Lost & Found
            </p>

            <p>
                Made for students
            </p>

        </div>

    </footer>

    <!-- Old JavaScript submit handler removed because the form is now handled by PHP/MySQL. -->

</body>

</html>