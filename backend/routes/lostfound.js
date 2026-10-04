const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();


// =====================================================
// IMAGE UPLOAD FOLDER
// =====================================================

const uploadFolder = path.join(
    __dirname,
    "..",
    "..",
    "lost_and_found",
    "uploads",
    "items"
);


// =====================================================
// CREATE UPLOAD FOLDER
// =====================================================

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, {
        recursive: true
    });
}


// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(
            null,
            uploadFolder
        );

    },

    filename: function(req, file, cb) {

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();

        const baseName =
            path.basename(
                file.originalname,
                extension
            )
            .replace(
                /[^a-zA-Z0-9-_]/g,
                "_"
            )
            .toLowerCase();

        const uniqueName =
            baseName +
            "_" +
            Date.now() +
            extension;

        cb(
            null,
            uniqueName
        );

    }

});


// =====================================================
// MULTER UPLOAD
// =====================================================

const upload = multer({

    storage: storage,

    limits: {

        fileSize:
            5 * 1024 * 1024

    },

    fileFilter:
        function(req, file, cb) {

            if (
                file.mimetype &&
                file.mimetype.startsWith(
                    "image/"
                )
            ) {

                cb(
                    null,
                    true
                );

            } else {

                cb(
                    new Error(
                        "Only image files are allowed."
                    )
                );

            }

        }

});


// =====================================================
// IMAGE FALLBACK MAP
// =====================================================
//
// IMPORTANT:
// These paths are based on the actual files inside:
//
// lost_and_found/uploads/items/
//
// =====================================================

const imageMap = {

    // =================================================
    // MOBILE
    // =================================================

    "mobile":
        "uploads/items/mobile.jpg",

    "mobile phone":
        "uploads/items/mobile.jpg",

    "phone":
        "uploads/items/mobile.jpg",

    "mobile cover":
        "uploads/items/mobilecover.jpg",

    "phone cover":
        "uploads/items/mobilecover.jpg",


    // =================================================
    // WALLET
    // =================================================

    "black wallet":
        "uploads/items/blackwallet.jpg",

    "wallet":
        "uploads/items/blackwallet.jpg",


    // =================================================
    // BAG
    // =================================================

    "black bag":
        "uploads/items/blackbag.jpg",

    "blackbag":
        "uploads/items/blackbag.jpg",

    "bag":
        "uploads/items/blackbag.jpg",


    // =================================================
    // POUCH
    // =================================================

    "pouch":
        "uploads/items/pouch.jpg",


    // =================================================
    // COLLEGE ID CARD
    // =================================================

    "college id card":
        "uploads/items/collegeidcard.jpg",

    "college id":
        "uploads/items/collegeidcard.jpg",

    "id card":
        "uploads/items/collegeidcard.jpg",

    "identity card":
        "uploads/items/collegeidcard.jpg",


    // =================================================
    // KEYCHAIN
    // =================================================

    "keychain":
        "uploads/items/keychain.jpg",

    "key chain":
        "uploads/items/keychain.jpg",


    // =================================================
    // UMBRELLA
    // =================================================

    "umbrella":
        "uploads/items/umbrella.jpg",


    // =================================================
    // LAPTOP CHARGER
    // =================================================

    "laptop charger":
        "uploads/items/laptopcharger.jpg",

    "laptopcharger":
        "uploads/items/laptopcharger.jpg",

    "charger":
        "uploads/items/laptopcharger.jpg",


    // =================================================
    // NOTEBOOK
    // =================================================

    "notebook":
        "uploads/items/notebook.jpg",

    "book":
        "uploads/items/notebook.jpg",


    // =================================================
    // EARPHONES
    // =================================================

    "earphones":
        "uploads/items/earphones.jpg",

    "earphone":
        "uploads/items/earphones.jpg",

    "airpods":
        "uploads/items/earphones.jpg",


    // =================================================
    // USB / PENDRIVE
    // =================================================

    "usb drive":
        "uploads/items/usbdrive.jpg",

    "usb":
        "uploads/items/usbdrive.jpg",

    "usbdrive":
        "uploads/items/usbdrive.jpg",

    "pendrive":
        "uploads/items/usbdrive.jpg",

    "pen drive":
        "uploads/items/usbdrive.jpg",


    // =================================================
    // SCIENTIFIC CALCULATOR
    // =================================================
    //
    // ACTUAL FILE:
    //
    // scientific calculator.jpg
    //
    // IMPORTANT:
    // %20 represents the space in the filename.
    // =================================================

    "scientific calculator":
        "uploads/items/scientific%20calculator.jpg",

    "scientificcalculator":
        "uploads/items/scientific%20calculator.jpg",

    "calculator":
        "uploads/items/scientific%20calculator.jpg",

    "casio scientific calculator":
        "uploads/items/scientific%20calculator.jpg",


    // =================================================
    // WATER BOTTLE
    // =================================================

    "water bottle":
        "uploads/items/waterbottle.jpg",

    "waterbottle":
        "uploads/items/waterbottle.jpg",

    "bottle":
        "uploads/items/waterbottle.jpg",


    // =================================================
    // GEOMETRY BOX
    // =================================================

    "geometry box":
        "uploads/items/geometrybox.jpg",

    "geometrybox":
        "uploads/items/geometrybox.jpg",


    // =================================================
    // SPECTACLES
    // =================================================

    "spectacles":
        "uploads/items/spectacles.jpg",

    "spectacle":
        "uploads/items/spectacles.jpg",

    "glasses":
        "uploads/items/spectacles.jpg",


    // =================================================
    // CHEMISTRY
    // =================================================

    "chem":
        "uploads/items/chem.jpg",

    "chemistry":
        "uploads/items/chem.jpg",

    "chemistry book":
        "uploads/items/chem.jpg",


    // =================================================
    // LAB FILE / YELLOW FILE
    // =================================================

    "lab file":
        "uploads/items/yellowfile.jpg",

    "labfile":
        "uploads/items/yellowfile.jpg",

    "lab":
        "uploads/items/yellowfile.jpg",

    "yellow file":
        "uploads/items/yellowfile.jpg",

    "yellowfile":
        "uploads/items/yellowfile.jpg",

    "file":
        "uploads/items/yellowfile.jpg"

};


// =====================================================
// GET CORRECT IMAGE
// =====================================================

function getCorrectImage(item) {

    const itemKey =
        item.item_name
            ? String(
                item.item_name
            )
                .trim()
                .toLowerCase()
            : "";


    // =================================================
    // FIRST: CHECK DATABASE IMAGE
    // =================================================

    if (
        item.image &&
        String(
            item.image
        ).trim() !== ""
    ) {

        const databaseImage =
            String(
                item.image
            ).trim();


        // -------------------------------------------------
        // Data URL
        // -------------------------------------------------

        if (
            databaseImage.startsWith(
                "data:"
            )
        ) {

            return databaseImage;

        }


        // -------------------------------------------------
        // External URL
        // -------------------------------------------------

        if (
            databaseImage.startsWith(
                "http://"
            ) ||
            databaseImage.startsWith(
                "https://"
            )
        ) {

            return databaseImage;

        }


        // -------------------------------------------------
        // Check local file
        // -------------------------------------------------

        const cleanPath =
            databaseImage.replace(
                /^\/+/,
                ""
            );


        const actualFilePath =
            path.join(
                uploadFolder,
                path.basename(
                    cleanPath
                )
            );


        if (
            fs.existsSync(
                actualFilePath
            )
        ) {

            return databaseImage;

        }

    }


    // =================================================
    // SECOND: USE IMAGE MAP
    // =================================================

    if (
        imageMap[itemKey]
    ) {

        return imageMap[itemKey];

    }


    // =================================================
    // THIRD: TRY NORMALIZED ITEM NAME
    // =================================================

    const normalizedKey =
        itemKey
            .replace(
                /[_-]+/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();


    if (
        imageMap[normalizedKey]
    ) {

        return imageMap[normalizedKey];

    }


    // =================================================
    // NO IMAGE FOUND
    // =================================================

    return null;

}


// =====================================================
// GET LOST ITEMS
// =====================================================

router.get(
    "/lost",
    function(req, res) {

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


        req.db.query(
            query,
            function(error, results) {

                if (error) {

                    console.log(
                        "Lost items error:",
                        error
                    );


                    return res.status(500).json({

                        error:
                            "Could not fetch lost items",

                        details:
                            error.message

                    });

                }


                const itemsWithImages =
                    results.map(
                        function(item) {

                            return {

                                ...item,

                                image:
                                    getCorrectImage(
                                        item
                                    )

                            };

                        }
                    );


                res.json(
                    itemsWithImages
                );

            }
        );

    }
);


// =====================================================
// GET FOUND ITEMS
// =====================================================

router.get(
    "/found",
    function(req, res) {

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
            WHERE LOWER(status) = 'found'
            ORDER BY serial_number DESC
        `;


        req.db.query(
            query,
            function(error, results) {

                if (error) {

                    console.log(
                        "Found items error:",
                        error
                    );


                    return res.status(500).json({

                        error:
                            "Could not fetch found items",

                        details:
                            error.message

                    });

                }


                const itemsWithImages =
                    results.map(
                        function(item) {

                            return {

                                ...item,

                                image:
                                    getCorrectImage(
                                        item
                                    )

                            };

                        }
                    );


                res.json(
                    itemsWithImages
                );

            }
        );

    }
);


// =====================================================
// REPORT LOST / FOUND ITEM
// =====================================================
//
// Both LOST and FOUND records are stored in:
//
// lost_items
//
// status = lost  -> Lost
// status = found -> Found
//
// =====================================================

router.post(
    "/",
    upload.single("image"),
    function(req, res) {


        // =================================================
        // GET FORM DATA
        // =================================================

        const item_name =
            String(
                req.body.item_name || ""
            ).trim();


        const status =
            String(
                req.body.status || ""
            )
                .trim()
                .toLowerCase();


        const location =
            String(
                req.body.location || ""
            ).trim();


        const description =
            String(
                req.body.description || ""
            ).trim();


        // =================================================
        // VALIDATE REQUIRED FIELDS
        // =================================================

        if (
            item_name === "" ||
            status === "" ||
            location === "" ||
            description === ""
        ) {

            if (
                req.file &&
                req.file.path
            ) {

                fs.unlink(
                    req.file.path,
                    function() {}
                );

            }


            return res.status(400).json({

                error:
                    "Please fill in all the required fields."

            });

        }


        // =================================================
        // VALIDATE STATUS
        // =================================================

        if (
            status !== "lost" &&
            status !== "found"
        ) {

            if (
                req.file &&
                req.file.path
            ) {

                fs.unlink(
                    req.file.path,
                    function() {}
                );

            }


            return res.status(400).json({

                error:
                    "Invalid item status."

            });

        }


        // =================================================
        // DEFAULT VALUES
        // =================================================

        const person_name =
            "Campus Student";


        const roll_number =
            "N/A";


        const contact_number =
            "N/A";


        // =================================================
        // IMAGE PATH
        // =================================================

        let imagePath = "";


        if (
            req.file
        ) {

            imagePath =
                "uploads/items/" +
                req.file.filename;

        }


        // =================================================
        // INSERT INTO DATABASE
        // =================================================

        const query = `
            INSERT INTO lost_items
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

            imagePath

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


                    if (
                        req.file &&
                        req.file.path
                    ) {

                        fs.unlink(
                            req.file.path,
                            function() {}
                        );

                    }


                    return res.status(500).json({

                        error:
                            "Could not save item",

                        details:
                            error.message

                    });

                }


                console.log(
                    "Item saved successfully."
                );


                console.log(
                    "Image path:",
                    imagePath
                );


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
                            imagePath

                    }

                });

            }
        );

    }
);


// =====================================================
// MULTER ERROR HANDLER
// =====================================================

router.use(
    function(error, req, res, next) {

        // =================================================
        // MULTER ERROR
        // =================================================

        if (
            error instanceof multer.MulterError
        ) {

            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {

                return res.status(400).json({

                    error:
                        "Image is too large. Maximum size is 5 MB."

                });

            }


            return res.status(400).json({

                error:
                    error.message

            });

        }


        // =================================================
        // OTHER ERRORS
        // =================================================

        if (
            error
        ) {

            return res.status(400).json({

                error:
                    error.message

            });

        }


        next();

    }
);


// =====================================================
// EXPORT
// =====================================================

module.exports =
    router;