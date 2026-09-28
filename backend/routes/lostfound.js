const express = require("express");

const router = express.Router();


// =====================================================
// IMAGE FALLBACK MAP
// =====================================================

const imageMap = {

    "mobile cover": "uploads/items/mobilecover.jpg",
    "mobile": "uploads/items/mobile.jpg",
    "black wallet": "uploads/items/blackwallet.jpg",
    "college id card": "uploads/items/collegeidcard.jpg",
    "keychain": "uploads/items/keychain.jpg",
    "umbrella": "uploads/items/umbrella.jpg",
    "laptop charger": "uploads/items/laptopcharger.jpg",
    "notebook": "uploads/items/notebook.jpg",
    "earphones": "uploads/items/earphones.jpg",
    "usb drive": "uploads/items/usbdrive.jpg",
    "scientific calculator": "uploads/items/scientificcalculator.jpg",
    "water bottle": "uploads/items/waterbottle.jpg"

};


// =====================================================
// GET ALL LOST ITEMS
// FROM lost_items TABLE
// =====================================================

router.get("/lost", function(req, res) {

    const query = `
        SELECT
            serial_number,
            roll_number,
            item_name,
            location,
            description,
            status,
            person_name,
            contact_number,
            image
        FROM lost_items
        WHERE LOWER(status) = 'lost'
        ORDER BY serial_number DESC
    `;


    req.db.query(query, function(error, results) {

        if (error) {

            console.log("Lost items error:", error);

            return res.status(500).json({
                error: "Could not fetch lost items"
            });

        }


        const itemsWithImages = results.map(function(item) {

            if (
                item.image &&
                item.image.trim() !== ""
            ) {

                return item;

            }


            const itemKey =
                item.item_name
                    ? item.item_name.trim().toLowerCase()
                    : "";


            return {
                ...item,
                image: imageMap[itemKey] || null
            };

        });


        res.json(itemsWithImages);

    });

});


// =====================================================
// GET ALL FOUND ITEMS
// FROM found_items TABLE
// =====================================================

router.get("/found", function(req, res) {

    const query = `
        SELECT
            serial_number,
            roll_number,
            item_name,
            location,
            description,
            status,
            person_name,
            contact_number,
            image
        FROM found_items
        WHERE LOWER(status) = 'found'
        ORDER BY serial_number DESC
    `;


    req.db.query(query, function(error, results) {

        if (error) {

            console.log("Found items error:", error);

            return res.status(500).json({
                error: "Could not fetch found items"
            });

        }


        const itemsWithImages = results.map(function(item) {

            if (
                item.image &&
                item.image.trim() !== ""
            ) {

                return item;

            }


            const itemKey =
                item.item_name
                    ? item.item_name.trim().toLowerCase()
                    : "";


            return {
                ...item,
                image: imageMap[itemKey] || null
            };

        });


        res.json(itemsWithImages);

    });

});


// =====================================================
// REPORT LOST / FOUND ITEM
// =====================================================

router.post("/", function(req, res) {

    const item_name =
        String(req.body.item_name || "").trim();


    const status =
        String(req.body.status || "")
            .trim()
            .toLowerCase();


    const location =
        String(req.body.location || "").trim();


    const description =
        String(req.body.description || "").trim();


    const image =
        String(req.body.image || "").trim();


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
        item_name === "" ||
        status === "" ||
        location === "" ||
        description === ""
    ) {

        return res.status(400).json({

            error:
                "Please fill in all the required fields."

        });

    }


    if (
        status !== "lost" &&
        status !== "found"
    ) {

        return res.status(400).json({

            error:
                "Invalid item status."

        });

    }


    // -------------------------------------------------
    // DEFAULT VALUES
    // -------------------------------------------------

    const person_name =
        "Campus Student";


    const roll_number =
        "N/A";


    const contact_number =
        "N/A";


    // -------------------------------------------------
    // CHOOSE TABLE
    // -------------------------------------------------

    const tableName =
        status === "lost"
            ? "lost_items"
            : "found_items";


    // -------------------------------------------------
    // INSERT
    // -------------------------------------------------

    const query = `
        INSERT INTO ${tableName}
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const values = [

        person_name,
        roll_number,
        item_name,
        location,
        status,
        contact_number,
        description,
        image

    ];


    req.db.query(
        query,
        values,
        function(error, result) {

            if (error) {

                console.log(
                    "Report item error:",
                    error
                );


                return res.status(500).json({

                    error:
                        "Could not save item"

                });

            }


            res.status(201).json({

                message:
                    "Item reported successfully.",

                item: {

                    serial_number:
                        result.insertId,

                    item_name:
                        item_name,

                    status:
                        status,

                    location:
                        location,

                    description:
                        description,

                    image:
                        image

                }

            });

        }
    );

});


module.exports = router;