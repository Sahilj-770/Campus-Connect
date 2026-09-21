<?php

require_once "../config/database.php";

/* ================= DATABASE ================= */

/* Get 4 most recent LOST items */
$lost_sql = "SELECT *
             FROM lost_items
             WHERE LOWER(status) = 'lost'
             ORDER BY serial_number DESC
             LIMIT 4";

$lost_result = $conn->query($lost_sql);

if (!$lost_result) {
    die("Database Error: " . $conn->error);
}


/* Get 4 most recent FOUND items */
$found_sql = "SELECT *
              FROM lost_items
              WHERE LOWER(status) = 'found'
              ORDER BY serial_number DESC
              LIMIT 4";

$found_result = $conn->query($found_sql);

if (!$found_result) {
    die("Database Error: " . $conn->error);
}

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Campus Lost & Found</title>

    <link rel="stylesheet" href="lost.css">


    <!-- ================= HOME PAGE IMAGE FIX ================= -->

    <style>

        /* Keep home page item images inside their card */

        .item-grid .item-image {
            width: 100%;
            height: 250px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }


        /* Actual uploaded item image */

        .item-grid .item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }


        /* Keep placeholder emoji normal */

        .item-grid .item-image .image-placeholder {
            font-size: 75px;
        }

    </style>

</head>


<body>


    <!-- ================= NAVIGATION BAR ================= -->

    <header class="navbar">

        <div class="logo">

            <img
                src="logo.png"
                alt="Lost & Found Logo"
                class="logo-image"
            >

            <span>
                Campus Lost & Found
            </span>

        </div>


        <nav>

            <a href="lost.php">
                Home
            </a>

            <a href="lost-items.php">
                Lost Items
            </a>

            <a href="found-items.php">
                Found Items
            </a>

            <a href="browse.html">
                Browse Items
            </a>

        </nav>


        <a
            href="#report"
            class="login-btn"
        >
            Report Item →
        </a>

    </header>



    <!-- ================= HERO SECTION ================= -->

    <section class="hero" id="home">

        <div class="hero-text">

            <p class="small-heading">
                CAMPUS LOST & FOUND
            </p>


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

                <a
                    href="#report"
                    class="primary-btn"
                >
                    Report an Item
                </a>


                <a
                    href="#items"
                    class="secondary-btn"
                >
                    Browse Items
                </a>

            </div>

        </div>



        <div class="hero-box">

            <div class="search-box">

                <h3>
                    Looking for something?
                </h3>


                <p>
                    Search through recently reported items.
                </p>


                <div class="search-bar">

                    <input
                        type="text"
                        id="searchInput"
                        placeholder="Search for an item..."
                    >


                    <button id="searchButton">
                        Search
                    </button>

                </div>

            </div>

        </div>

    </section>



    <!-- ================= QUICK ACTIONS ================= -->

    <section class="quick-section">

        <div class="section-title">

            <p class="small-heading">
                GET STARTED
            </p>


            <h2>
                What would you like to do?
            </h2>

        </div>



        <div class="quick-cards">


            <div class="quick-card">

                <div class="quick-icon lost-icon">
                    🎒
                </div>


                <h3>
                    I lost something
                </h3>


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


                <h3>
                    I found something
                </h3>


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


                <h3>
                    I'm looking for an item
                </h3>


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



    <!-- ================= RECENT LOST ITEMS ================= -->

    <section class="items-section" id="items">

        <div class="section-heading-row">

            <div>

                <p class="small-heading">
                    RECENT LOST ITEMS
                </p>


                <h2>
                    Recently lost items
                </h2>

            </div>


            <a
                href="lost-items.php"
                class="view-all"
            >
                View all →
            </a>

        </div>



        <div class="item-grid">


            <?php if ($lost_result->num_rows > 0): ?>


                <?php while ($row = $lost_result->fetch_assoc()): ?>


                    <div class="item-card">


                        <!-- IMAGE -->

                        <div class="item-image blue-image">

                            <?php

                            $imagePath = trim($row["image"] ?? "");

                            ?>


                            <?php if ($imagePath !== ""): ?>

                                <img
                                    src="<?php echo htmlspecialchars($imagePath); ?>"
                                    alt="<?php echo htmlspecialchars($row["item_name"]); ?>"
                                >

                            <?php else: ?>

                                <span class="image-placeholder">
                                    📦
                                </span>

                            <?php endif; ?>

                        </div>



                        <!-- CONTENT -->

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

                                <?php

                                echo htmlspecialchars(
                                    $row["item_name"]
                                );

                                ?>

                            </h3>



                            <p>

                                <?php

                                echo htmlspecialchars(
                                    $row["description"] ?? ""
                                );

                                ?>

                            </p>



                            <div class="item-location">

                                📍

                                <?php

                                echo htmlspecialchars(
                                    $row["location"]
                                );

                                ?>

                            </div>

                        </div>

                    </div>


                <?php endwhile; ?>


            <?php else: ?>


                <p>
                    No lost items reported yet.
                </p>


            <?php endif; ?>


        </div>

    </section>



    <!-- ================= RECENT FOUND ITEMS ================= -->

    <section class="items-section">

        <div class="section-heading-row">

            <div>

                <p class="small-heading">
                    RECENT FOUND ITEMS
                </p>


                <h2>
                    Recently found items
                </h2>

            </div>


            <a
                href="found-items.php"
                class="view-all"
            >
                View all →
            </a>

        </div>



        <div class="item-grid">


            <?php if ($found_result->num_rows > 0): ?>


                <?php while ($row = $found_result->fetch_assoc()): ?>


                    <div class="item-card">


                        <!-- IMAGE -->

                        <div class="item-image orange-image">

                            <?php

                            $imagePath = trim($row["image"] ?? "");

                            ?>


                            <?php if ($imagePath !== ""): ?>

                                <img
                                    src="<?php echo htmlspecialchars($imagePath); ?>"
                                    alt="<?php echo htmlspecialchars($row["item_name"]); ?>"
                                >

                            <?php else: ?>

                                <span class="image-placeholder">
                                    📦
                                </span>

                            <?php endif; ?>

                        </div>



                        <!-- CONTENT -->

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

                                <?php

                                echo htmlspecialchars(
                                    $row["item_name"]
                                );

                                ?>

                            </h3>



                            <p>

                                <?php

                                echo htmlspecialchars(
                                    $row["description"] ?? ""
                                );

                                ?>

                            </p>



                            <div class="item-location">

                                📍

                                <?php

                                echo htmlspecialchars(
                                    $row["location"]
                                );

                                ?>

                            </div>

                        </div>

                    </div>


                <?php endwhile; ?>


            <?php else: ?>


                <p>
                    No found items reported yet.
                </p>


            <?php endif; ?>


        </div>

    </section>



    <!-- ================= HOW IT WORKS ================= -->

    <section
        class="how-section"
        id="how-it-works"
    >

        <div class="section-title">

            <p class="small-heading">
                SIMPLE PROCESS
            </p>


            <h2>
                How Campus Lost & Found works
            </h2>


            <p>
                Getting an item back doesn't have to be complicated.
            </p>

        </div>



        <div class="steps">


            <div class="step">

                <div class="step-number">
                    01
                </div>


                <h3>
                    Report
                </h3>


                <p>
                    Submit details about the item you
                    lost or found.
                </p>

            </div>



            <div class="step">

                <div class="step-number">
                    02
                </div>


                <h3>
                    Search
                </h3>


                <p>
                    Students can browse the reported
                    items on campus.
                </p>

            </div>



            <div class="step">

                <div class="step-number">
                    03
                </div>


                <h3>
                    Match
                </h3>


                <p>
                    Compare the item details to find
                    a possible match.
                </p>

            </div>



            <div class="step">

                <div class="step-number">
                    04
                </div>


                <h3>
                    Collect
                </h3>


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

            <h2>
                120+
            </h2>

            <p>
                Items Reported
            </p>

        </div>


        <div class="stat">

            <h2>
                85+
            </h2>

            <p>
                Items Returned
            </p>

        </div>


        <div class="stat">

            <h2>
                60+
            </h2>

            <p>
                Active Students
            </p>

        </div>


        <div class="stat">

            <h2>
                24/7
            </h2>

            <p>
                Reporting Available
            </p>

        </div>

    </section>



    <!-- ================= REPORT SECTION ================= -->

    <section
        class="report-section"
        id="report"
    >

        <div class="report-content">

            <p class="small-heading">
                REPORT AN ITEM
            </p>


            <h2>
                Report a lost or found item.
            </h2>


            <p>
                Enter the details below so other students
                can help return the item to its owner.
            </p>

        </div>



        <div class="report-form">


            <form
                method="POST"
                action="reportlostitem.php"
                enctype="multipart/form-data"
            >


                <input
                    type="text"
                    id="itemName"
                    name="item_name"
                    placeholder="Item name"
                    required
                >


                <select
                    id="itemStatus"
                    name="status"
                    required
                >

                    <option value="lost">
                        I Lost This Item
                    </option>


                    <option value="found">
                        I Found This Item
                    </option>

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
                    required
                ></textarea>


                <!-- ================= IMAGE UPLOAD ================= -->

                <input
                    type="file"
                    id="itemImage"
                    name="item_image"
                    accept="image/*"
                >


                <button
                    type="submit"
                    class="primary-btn"
                    id="submitReport"
                >
                    Submit Report
                </button>


            </form>

        </div>

    </section>



    <!-- ================= FOOTER ================= -->

    <footer id="contact">

        <div class="footer-main">


            <div class="footer-about">

                <h3>
                    Campus Lost & Found
                </h3>


                <p>
                    A student-friendly platform for
                    managing lost and found items
                    within the campus.
                </p>

            </div>



            <div class="footer-links">

                <h4>
                    Quick Links
                </h4>


                <a href="lost.php">
                    Home
                </a>


                <a href="lost-items.php">
                    Lost Items
                </a>


                <a href="#how-it-works">
                    How It Works
                </a>

            </div>



            <div class="footer-links">

                <h4>
                    Contact
                </h4>


                <p>
                    College Campus
                </p>


                <p>
                    Student Support Desk
                </p>


                <p>
                    campus@example.com
                </p>

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



    <script src="lost.js"></script>


</body>

</html>

<?php

$conn->close();

?>