// =====================================================
// 1. IMPORT PACKAGES
// =====================================================

require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const fs = require("fs");
const path = require("path");


// =====================================================
// 2. CREATE EXPRESS APP
// =====================================================

const app = express();

const PORT = Number(process.env.PORT || 3000);


// =====================================================
// 3. ENABLE CORS + JSON
// =====================================================

app.use(cors());

app.use(express.json({
    limit: "10mb"
}));


// =====================================================
// 4. CONNECT TO MYSQL
// =====================================================

const canteenDB = mysql.createConnection({
    host: process.env.CANTEEN_DB_HOST,
    user: process.env.CANTEEN_DB_USER,
    password: process.env.CANTEEN_DB_PASSWORD || "",
    database: process.env.CANTEEN_DB_NAME,
    port: Number(process.env.CANTEEN_DB_PORT || 3306)
});

const lostFoundSslCa = process.env.LOST_FOUND_DB_SSL_CA
    ? process.env.LOST_FOUND_DB_SSL_CA.replace(/\\n/g, "\n")
    : "";

const lostFoundDB = mysql.createConnection({
    host: process.env.LOST_FOUND_DB_HOST,
    user: process.env.LOST_FOUND_DB_USER,
    password: process.env.LOST_FOUND_DB_PASSWORD || "",
    database: process.env.LOST_FOUND_DB_NAME,
    port: Number(process.env.LOST_FOUND_DB_PORT || 3306),
    ...(lostFoundSslCa
        ? {
            ssl: {
                ca: lostFoundSslCa,
                rejectUnauthorized: true
            }
        }
        : {})
});


// =====================================================
// LOST & FOUND ROUTES
// =====================================================

const lostFoundRoutes =
    require("./routes/lostfound");


// =====================================================
// 5. TEST MYSQL CONNECTION
// =====================================================

canteenDB.connect(function(error) {
    if (error) {
        console.log("Canteen MySQL connection failed:", error);
    } else {
        console.log("Canteen MySQL connected successfully!");
    }
});

lostFoundDB.connect(function(error) {
    if (error) {
        console.log("Lost & Found MySQL connection failed:", error);
    } else {
        console.log("Lost & Found MySQL connected successfully!");
    }
});


// =====================================================
// MAKE DATABASE AVAILABLE TO ROUTES
// =====================================================

// Database access is assigned per feature below so each module uses its own MySQL database.


// =====================================================
// LOST & FOUND API
// =====================================================

app.use(
    "/api/lost-found",
    function(req, res, next) {
        req.db = lostFoundDB;
        next();
    },
    lostFoundRoutes
);


// =====================================================
// 6. LOST & FOUND FRONTEND
// =====================================================

// Your project structure should be:
//
// Campus-Connect
// │
// ├── backend
// │   ├── server.js
// │   └── routes
// │
// └── lost_and_found
//     ├── lost.html
//     ├── lost-items.html
//     ├── found-items.html
//     ├── browse.html
//     ├── lost.css
//     ├── logo.png
//     └── uploads
//

const frontendPath =
    path.join(
        __dirname,
        "..",
        "lost_and_found"
    );


// =====================================================
// CHECK FRONTEND FOLDER
// =====================================================

console.log(
    "Lost & Found frontend path:",
    frontendPath
);


if (!fs.existsSync(frontendPath)) {

    console.log(
        "WARNING: lost_and_found folder was NOT found."
    );

    console.log(
        "Expected folder:",
        frontendPath
    );

} else {

    console.log(
        "Lost & Found frontend folder found!"
    );

}


// =====================================================
// SERVE LOST & FOUND FILES
// =====================================================

app.use(
    express.static(frontendPath)
);


// =====================================================
// ALSO SUPPORT /lost_and_found/ URL
// =====================================================

app.use(
    "/lost_and_found",
    express.static(frontendPath)
);

// Serve uploaded Lost & Found images
app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "..",
            "lost_and_found",
            "uploads"
        )
    )
);


// =====================================================
// HOME PAGE
// =====================================================

app.get("/", function(req, res) {
    res.json({
        status: "ok",
        service: "CampusConnect API"
    });
});

app.get("/health", function(req, res) {
    res.json({
        status: "healthy"
    });
});


// =====================================================
// EXPLICIT LOST & FOUND PAGES
// =====================================================

// Home
app.get(
    "/lost_and_found/lost.html",
    function(req, res) {

        res.sendFile(
            path.join(
                frontendPath,
                "lost.html"
            )
        );

    }
);


// Lost Items
app.get(
    "/lost_and_found/lost-items.html",
    function(req, res) {

        res.sendFile(
            path.join(
                frontendPath,
                "lost-items.html"
            )
        );

    }
);


// Found Items
app.get(
    "/lost_and_found/found-items.html",
    function(req, res) {

        res.sendFile(
            path.join(
                frontendPath,
                "found-items.html"
            )
        );

    }
);


// Browse
app.get(
    "/lost_and_found/browse.html",
    function(req, res) {

        res.sendFile(
            path.join(
                frontendPath,
                "browse.html"
            )
        );

    }
);


// =====================================================
// 7. GET MENU FROM MYSQL
// =====================================================

app.get(
    "/api/menu/:canteen",
    function(req, res) {

        const canteen =
            req.params.canteen;

        let tableName;


        // Decide which MySQL table to use

        if (canteen === "cafeteria") {

            tableName =
                "campus_cafeteria";

        }

        else if (canteen === "timeless") {

            tableName =
                "cafe_timeless";

        }

        else if (canteen === "nescafe") {

            tableName =
                "nescafe";

        }

        else {

            return res.status(400).json({

                error:
                    "Invalid canteen"

            });

        }


        // Get menu items from MySQL

        const query = `

            SELECT
                item_id,
                item_name,
                category,
                price,
                availability,
                description

            FROM ${tableName}

        `;


        canteenDB.query(
            query,
            function(error, results) {

                if (error) {

                    console.log(
                        "Database query failed:",
                        error
                    );

                    return res.status(500).json({

                        error:
                            "Could not fetch menu"

                    });

                }


                res.json(results);

            }
        );

    }
);


// =====================================================
// ALL CANTEENS MENU
// =====================================================

app.get(
    "/api/menu/all",
    function(req, res) {

        const queries = {

            cafeteria: `

                SELECT
                    item_id,
                    item_name,
                    category,
                    price,
                    availability,
                    description

                FROM campus_cafeteria

            `,

            timeless: `

                SELECT
                    item_id,
                    item_name,
                    category,
                    price,
                    availability,
                    description

                FROM cafe_timeless

            `,

            nescafe: `

                SELECT
                    item_id,
                    item_name,
                    category,
                    price,
                    availability,
                    description

                FROM nescafe

            `

        };


        canteenDB.query(
            queries.cafeteria,
            function(error, cafeteria) {

                if (error) {

                    console.log(
                        "Cafeteria error:",
                        error
                    );

                    return res.status(500).json({

                        error:
                            "Could not load cafeteria menu"

                    });

                }


                canteenDB.query(
                    queries.timeless,
                    function(error, timeless) {

                        if (error) {

                            console.log(
                                "Timeless error:",
                                error
                            );

                            return res.status(500).json({

                                error:
                                    "Could not load Timeless menu"

                            });

                        }


                        canteenDB.query(
                            queries.nescafe,
                            function(error, nescafe) {

                                if (error) {

                                    console.log(
                                        "Nescafe error:",
                                        error
                                    );

                                    return res.status(500).json({

                                        error:
                                            "Could not load Nescafe menu"

                                    });

                                }


                                const allItems = [

                                    ...cafeteria.map(
                                        function(item) {

                                            return {

                                                ...item,

                                                canteen:
                                                    "Cafeteria"

                                            };

                                        }
                                    ),


                                    ...timeless.map(
                                        function(item) {

                                            return {

                                                ...item,

                                                canteen:
                                                    "Timeless"

                                            };

                                        }
                                    ),


                                    ...nescafe.map(
                                        function(item) {

                                            return {

                                                ...item,

                                                canteen:
                                                    "Nescafe"

                                            };

                                        }
                                    )

                                ];


                                res.json(
                                    allItems
                                );

                            }
                        );

                    }
                );

            }
        );

    }
);


// =====================================================
// AI FOOD IMAGE GENERATOR
// =====================================================

app.get(
    "/api/food-image/:canteen/:foodName",
    async function(req, res) {

        const canteen =
            req.params.canteen;

        const foodName =
            req.params.foodName;


        // Create safe filename

        const safeCanteen =
            canteen
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                );


        const safeFoodName =
            foodName
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    "-"
                );


        const fileName =
            safeCanteen +
            "-" +
            safeFoodName +
            ".jpg";


        const filePath =
            path.join(
                foodImagesFolder,
                fileName
            );


        // ======================================
        // IMAGE ALREADY EXISTS
        // ======================================

        if (fs.existsSync(filePath)) {

            console.log(
                "Using saved image:",
                fileName
            );


            return res.json({

                image:
                    "/food-images/" +
                    fileName

            });

        }


        // ======================================
        // GENERATE NEW AI IMAGE
        // ======================================

        console.log(
            "Generating AI image for:",
            foodName
        );


        const prompt =
            "Professional realistic food photography " +
            "of " +
            foodName +
            ", Indian college cafeteria food, " +
            "appetizing presentation, served on a " +
            "clean ceramic plate, warm natural lighting, " +
            "close-up food photography, realistic texture, " +
            "high quality, no people, no text, no watermark";


        const imageURL =
            "https://image.pollinations.ai/prompt/" +
            encodeURIComponent(prompt) +
            "?model=flux" +
            "&width=600" +
            "&height=400" +
            "&nologo=true" +
            "&private=true";


        try {

            const response =
                await fetch(imageURL);


            if (!response.ok) {

                throw new Error(
                    "AI image generation failed: " +
                    response.status
                );

            }


            // Convert response to image data

            const imageBuffer =
                Buffer.from(
                    await response.arrayBuffer()
                );


            // Save image permanently

            fs.writeFileSync(
                filePath,
                imageBuffer
            );


            console.log(
                "Image saved:",
                fileName
            );


            // Send saved image path

            res.json({

                image:
                    "/food-images/" +
                    fileName

            });


        }

        catch (error) {

            console.log(
                "AI image error:",
                error.message
            );


            res.status(500).json({

                error:
                    "Could not generate food image"

            });

        }

    }
);


// =====================================================
// AI FOOD IMAGE STORAGE
// =====================================================

const foodImagesFolder =
    path.join(
        __dirname,
        "food-images"
    );


// =====================================================
// MAKE FOOD IMAGES ACCESSIBLE
// =====================================================

app.use(
    "/food-images",
    express.static(
        foodImagesFolder
    )
);


// =====================================================
// CREATE FOOD IMAGE FOLDER
// =====================================================

if (
    !fs.existsSync(
        foodImagesFolder
    )
) {

    fs.mkdirSync(
        foodImagesFolder,
        {
            recursive: true
        }
    );

}


// =====================================================
// START SERVER
// =====================================================

app.listen(
    PORT,
    "0.0.0.0",
    function() {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);