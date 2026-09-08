// =====================================================
// 1. IMPORT PACKAGES
// =====================================================

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");


// =====================================================
// 2. CREATE EXPRESS APP
// =====================================================

const app = express();

const PORT = 3000;


// =====================================================
// 3. ENABLE CORS
// =====================================================

app.use(cors());


// =====================================================
// 4. CONNECT TO MYSQL
// =====================================================

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Aayush@52007",
    database: "campusconnect"
});


// =====================================================
// 5. TEST MYSQL CONNECTION
// =====================================================

db.connect(function(error) {

    if (error) {
        console.log("MySQL connection failed:", error);
        return;
    }

    console.log("MySQL connected successfully!");

});


// =====================================================
// 6. TEST BACKEND
// =====================================================

app.get("/", function(req, res) {

    res.send("Campus Connect Backend is working!");

});

// =====================================================
// 8. GET MENU FROM MYSQL
// =====================================================

app.get("/api/menu/:canteen", function(req, res) {

    const canteen = req.params.canteen;

    let tableName;


    // Decide which MySQL table to use

    if (canteen === "cafeteria") {

        tableName = "campus_cafeteria";

    } else if (canteen === "timeless") {

        tableName = "cafe_timeless";

    } else if (canteen === "nescafe") {

        tableName = "nescafe";

    } else {

        return res.status(400).json({
            error: "Invalid canteen"
        });

    }


    // Get menu items from MySQL

    const query = `
        SELECT item_id, item_name, category, price, availability, description
        FROM ${tableName}
    `;


    db.query(query, function(error, results) {

        if (error) {

            console.log("Database query failed:", error);

            return res.status(500).json({
                error: "Could not fetch menu"
            });

        }


        res.json(results);

    });

});


// =====================================================
// 7. START SERVER
// =====================================================

app.listen(PORT, function() {

    console.log(`Server running at http://localhost:${PORT}`);

});

