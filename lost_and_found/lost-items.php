<?php

require_once "../config/database.php";

/* Get all lost items */
$sql = "SELECT *
        FROM lost_items
        WHERE LOWER(status) = 'lost'
        ORDER BY serial_number DESC";

$result = $conn->query($sql);

if (!$result) {
    die("Database Error: " . $conn->error);
}


/* =====================================================
   IMAGE MAP
   ===================================================== */

$imageMap = [

    "keychain" => "uploads/items/keychain.jpg",

    "umbrella" => "uploads/items/umbrella.jpg",

    "laptop charger" => "uploads/items/laptopcharger.jpg",

    "notebook" => "uploads/items/notebook.jpg",

    "earphones" => "uploads/items/earphones.jpg",

    "usb drive" => "uploads/items/usbdrive.jpg",

    "scientific calculator" => "uploads/items/scientificcalculator.jpg",

    "water bottle" => "uploads/items/waterbottle.jpg",

    "black wallet" => "uploads/items/blackwallet.jpg"

];

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Lost Items - Campus Lost & Found</title>

    <link rel="stylesheet" href="lost.css">

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
            href="lost.php#report"
            class="login-btn"
        >
            Report Item →
        </a>

    </header>



    <!-- ================= LOST ITEMS PAGE ================= -->

    <section class="items-page">


        <div class="items-heading">

            <p class="small-heading">
                LOST ITEMS
            </p>


            <h1>

                Items that are
                <span>Lost</span>

            </h1>


            <p>

                Browse items that have been reported lost
                by students on campus.

            </p>

        </div>



        <!-- ================= LOST ITEMS ================= -->

        <div class="items-grid">


            <?php if ($result->num_rows > 0): ?>


                <?php while ($row = $result->fetch_assoc()): ?>


                    <?php

                    /*
                     * Get item name from database
                     */
                    $itemName = trim($row["item_name"] ?? "");


                    /*
                     * Convert item name to lowercase
                     * so it matches the image map
                     */
                    $itemKey = strtolower($itemName);


                    /*
                     * First check if database already
                     * contains an image path.
                     */
                    $imagePath = trim($row["image"] ?? "");


                    /*
                     * If database image is empty,
                     * automatically select image
                     * based on item name.
                     */
                    if ($imagePath === "" && isset($imageMap[$itemKey])) {

                        $imagePath = $imageMap[$itemKey];

                    }

                    ?>


                    <div class="item-card">


                        <!-- ================= IMAGE ================= -->

                        <div class="item-image blue-image">


                            <?php if ($imagePath !== ""): ?>


                                <img
                                    src="<?php echo htmlspecialchars($imagePath); ?>"
                                    alt="<?php echo htmlspecialchars($itemName); ?>"
                                    class="lost-item-image"
                                >


                            <?php else: ?>


                                <span style="font-size: 60px;">
                                    📦
                                </span>


                            <?php endif; ?>


                        </div>



                        <!-- ================= ITEM CONTENT ================= -->

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

                                echo htmlspecialchars($itemName);

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
                                    $row["location"] ?? ""
                                );

                                ?>

                            </div>


                        </div>


                    </div>


                <?php endwhile; ?>


            <?php else: ?>


                <div class="no-items">

                    <h3>

                        No lost items reported yet.

                    </h3>


                    <p>

                        Be the first to report a lost item.

                    </p>

                </div>


            <?php endif; ?>


        </div>


    </section>



    <!-- ================= FOOTER ================= -->

    <footer>

        <p>

            © 2026 Campus Lost & Found

        </p>

    </footer>



</body>

</html>


<?php

$conn->close();

?>