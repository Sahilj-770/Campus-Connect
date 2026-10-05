// =====================================================
// CAMPUS BITES - CANTEENS BACKEND
// =====================================================

// -------------------------
// IMPORT PACKAGES
// -------------------------

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

// Load .env file
dotenv.config();


// -------------------------
// CREATE EXPRESS APP
// -------------------------

const app = express();


// -------------------------
// MIDDLEWARE
// -------------------------

app.use(cors());

app.use(express.json());


// -------------------------
// MYSQL CONNECTION
// -------------------------

const db = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT

});


// -------------------------
// CONNECT TO MYSQL
// -------------------------

db.connect((err) => {

    if (err) {

        console.error("MySQL connection failed:");

        console.error(err.message);

        return;

    }

    console.log("MySQL connected successfully!");

});


// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {

    res.json({

        message: "Campus Bites Canteen Backend is running!"

    });

});


// =====================================================
// GET ALL CANTEENS
// =====================================================

app.get("/api/canteens", (req, res) => {

    const sql = `
        SELECT
            canteen_id,
            canteen_name,
            location
        FROM canteens
        ORDER BY canteen_id
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({

                error: "Failed to fetch canteens"

            });

        }

        res.json(results);

    });

});


// =====================================================
// GET MENU FOR A PARTICULAR CANTEEN
// =====================================================

app.get("/api/menu/:canteen", (req, res) => {

    const canteen = req.params.canteen;


    // Convert frontend name into database canteen name

    const canteenNames = {

        cafeteria: "Cafeteria",

        timeless: "Timeless",

        nescafe: "Nescafe"

    };


    const canteenName = canteenNames[canteen];


    // Check if canteen exists

    if (!canteenName) {

        return res.status(404).json({

            error: "Canteen not found"

        });

    }


    const sql = `

        SELECT

            m.item_id,

            m.item_name,

            m.price,

            m.description,

            m.is_bestseller,

            m.is_new,

            m.availability,

            c.canteen_name,

            cu.cuisine_name AS category

        FROM menu_items m

        JOIN canteens c
            ON m.canteen_id = c.canteen_id

        JOIN cuisines cu
            ON m.cuisine_id = cu.cuisine_id

        WHERE c.canteen_name = ?

        ORDER BY m.item_id

    `;


    db.query(

        sql,

        [canteenName],

        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({

                    error: "Failed to fetch menu"

                });

            }


            res.json(results);

        }

    );

});


// =====================================================
// GET ALL MENU ITEMS
// =====================================================

app.get("/api/menu", (req, res) => {

    const sql = `

        SELECT

            m.item_id,

            m.item_name,

            m.price,

            m.description,

            m.is_bestseller,

            m.is_new,

            m.availability,

            c.canteen_name,

            cu.cuisine_name AS category

        FROM menu_items m

        JOIN canteens c
            ON m.canteen_id = c.canteen_id

        JOIN cuisines cu
            ON m.cuisine_id = cu.cuisine_id

        ORDER BY m.item_id

    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.error(err);

            return res.status(500).json({

                error: "Failed to fetch menu"

            });

        }


        res.json(results);

    });

});


// =====================================================
// GET SINGLE MENU ITEM
// =====================================================

app.get("/api/menu/item/:id", (req, res) => {

    const itemId = req.params.id;


    const sql = `

        SELECT

            m.item_id,

            m.item_name,

            m.price,

            m.description,

            m.is_bestseller,

            m.is_new,

            m.availability,

            c.canteen_name,

            cu.cuisine_name AS category

        FROM menu_items m

        JOIN canteens c
            ON m.canteen_id = c.canteen_id

        JOIN cuisines cu
            ON m.cuisine_id = cu.cuisine_id

        WHERE m.item_id = ?

    `;


    db.query(

        sql,

        [itemId],

        (err, results) => {

            if (err) {

                console.error(err);

                return res.status(500).json({

                    error: "Failed to fetch menu item"

                });

            }


            if (results.length === 0) {

                return res.status(404).json({

                    error: "Menu item not found"

                });

            }


            res.json(results[0]);

        }

    );

});


// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `Campus Bites backend running at http://localhost:${PORT}`
    );

});