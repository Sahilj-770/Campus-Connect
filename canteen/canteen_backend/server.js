// ======================================================
// CAMPUS CONNECT - CANTEENS BACKEND
// ======================================================

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();


// ======================================================
// CREATE EXPRESS APP
// ======================================================

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());

app.use(express.json());


// ======================================================
// MYSQL CONNECTION
// ======================================================

const db = mysql.createConnection({

    host: process.env.DB_HOST,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    port: process.env.DB_PORT

});


// ======================================================
// CONNECT TO MYSQL
// ======================================================

db.connect((err) => {

    if (err) {

        console.error("MySQL connection failed:");
        console.error(err.message);

        return;
    }

    console.log("MySQL connected successfully!");

});


// ======================================================
// HOME / TEST ROUTE
// ======================================================

app.get("/", (req, res) => {

    res.json({
        message: "Campus Connect Canteens Backend is running!"
    });

});


// ======================================================
// GET ALL CANTEENS
// ======================================================

app.get("/api/canteens", (req, res) => {

    const canteens = [
        {
            id: "cafeteria",
            name: "Cafeteria"
        },
        {
            id: "timeless",
            name: "Timeless"
        },
        {
            id: "nescafe",
            name: "Nescafe"
        }
    ];

    res.json(canteens);

});


// ======================================================
// GET CAFETERIA MENU
// ======================================================

app.get("/api/menu/cafeteria", (req, res) => {

    const sql = `
        SELECT
            item_id,
            item_name,
            category,
            price,
            availability,
            description
        FROM campus_cafeteria
        ORDER BY item_id
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Cafeteria query error:", err);

            return res.status(500).json({
                error: "Failed to fetch cafeteria menu"
            });

        }

        res.json(results);

    });

});


// ======================================================
// GET TIMELESS MENU
// ======================================================

app.get("/api/menu/timeless", (req, res) => {

    const sql = `
        SELECT
            item_id,
            item_name,
            category,
            price,
            availability,
            description
        FROM cafe_timeless
        ORDER BY item_id
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Timeless query error:", err);

            return res.status(500).json({
                error: "Failed to fetch Timeless menu"
            });

        }

        res.json(results);

    });

});


// ======================================================
// GET NESCAFE MENU
// ======================================================

app.get("/api/menu/nescafe", (req, res) => {

    const sql = `
        SELECT
            item_id,
            item_name,
            category,
            price,
            availability,
            description
        FROM nescafe
        ORDER BY item_id
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error("Nescafe query error:", err);

            return res.status(500).json({
                error: "Failed to fetch Nescafe menu"
            });

        }

        res.json(results);

    });

});


// ======================================================
// GET MENU BY CANTEEN
// ======================================================

app.get("/api/menu/:canteen", (req, res) => {

    const canteen = req.params.canteen.toLowerCase();

    let tableName;


    // Decide which database table to use

    if (canteen === "cafeteria") {

        tableName = "campus_cafeteria";

    } else if (canteen === "timeless") {

        tableName = "cafe_timeless";

    } else if (canteen === "nescafe") {

        tableName = "nescafe";

    } else {

        return res.status(404).json({
            error: "Canteen not found"
        });

    }


    const sql = `
        SELECT
            item_id,
            item_name,
            category,
            price,
            availability,
            description
        FROM ${tableName}
        ORDER BY item_id
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.error("Menu query error:", err);

            return res.status(500).json({
                error: "Failed to fetch menu"
            });

        }

        res.json(results);

    });

});


// ======================================================
// GET SINGLE ITEM
// ======================================================

app.get("/api/item/:canteen/:id", (req, res) => {

    const canteen = req.params.canteen.toLowerCase();

    const itemId = req.params.id;

    let tableName;


    if (canteen === "cafeteria") {

        tableName = "campus_cafeteria";

    } else if (canteen === "timeless") {

        tableName = "cafe_timeless";

    } else if (canteen === "nescafe") {

        tableName = "nescafe";

    } else {

        return res.status(404).json({
            error: "Canteen not found"
        });

    }


    const sql = `
        SELECT
            item_id,
            item_name,
            category,
            price,
            availability,
            description
        FROM ${tableName}
        WHERE item_id = ?
    `;


    db.query(sql, [itemId], (err, results) => {

        if (err) {

            console.error("Item query error:", err);

            return res.status(500).json({
                error: "Failed to fetch item"
            });

        }


        if (results.length === 0) {

            return res.status(404).json({
                error: "Item not found"
            });

        }


        res.json(results[0]);

    });

});


// ======================================================
// SERVER
// ======================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Campus Connect Canteens Backend running at http://localhost:${PORT}`
    );

});