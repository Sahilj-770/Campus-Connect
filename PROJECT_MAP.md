# Campus-Connect Project Map

> Start here. This file maps where each feature lives and how its pieces connect.
> Integration rule: preserve the current UI/UX. Make only connection fixes and necessary supporting changes.

## Current structure

    Campus-Connect/
    ├── index.html                 Main CampusConnect home
    ├── landing.html               Landing page
    ├── Main/                      Main UI, dashboard, sign-in, shared CSS/JS
    ├── canteen/                   Campus Bites frontend
    ├── lost_and_found/            Lost & Found module
    ├── backend/                   Node.js + Express + MySQL API
    ├── api-test.html
    ├── logo.png
    └── PROJECT_MAP.md             This file

## Main CampusConnect flow

    index.html
        ├── Main/style.css
        ├── Main/home.css
        ├── Main/home-no-animation.css
        ├── Main/navbar.css
        └── Main/script.js
             │
             ├── Dashboard → Main/dashboard.html
             ├── Contact   → Main/contact.html
             ├── Canteen   → canteen/index.html
             └── Lost & Found → lost_and_found/lost.php

## Canteen / Campus Bites

    canteen/index.html / canteen/menu.html
                    ↓
             canteen/js/menu.js
                    ↓
             Express backend
                    ↓
       GET /api/menu/cafeteria
       GET /api/menu/timeless
       GET /api/menu/nescafe
       GET /api/menu/all
                    ↓
                 MySQL
       ├── campus_cafeteria
       ├── cafe_timeless
       └── nescafe

Food images also flow through:

    menu.js → /api/food-image/:canteen/:foodName → backend/food-images/

Cart and favourite canteen state currently use browser localStorage. Do not move these into authentication yet.

## Lost & Found

Current Lost & Found is PHP + MySQL, while Canteen is Node.js + Express + MySQL.

    lost.php
       ├── reads lost_items
       └── reads found_items

    report form
       ├── LOST  → reportlostitem.php → lost_items
       └── FOUND → reportfounditem.php → found_items

DB-backed pages:

    lost.php
    lost-items.php
    found-items.php
    reportlostitem.php
    reportfounditem.php

Older/static pages still present:

    lost.html
    lost-items.html
    found-items.html
    browse.html

## Important integration gaps found

1. Some main pages still link to lost_and_found/lost.html, while the database-backed page is lost_and_found/lost.php.

2. browse.html is still hardcoded and does not read the database.

3. The PHP files require ../config/database.php, but that file/folder is not present in this GitHub repository. I will not invent its credentials or schema.

4. The Lost & Found form sends the upload field as item_image, while reportlostitem.php currently checks for image. This is a connection bug and can be fixed without changing the UI.

5. reportfounditem.php currently does not process the uploaded image even though the main report form allows one.

6. The Node backend currently contains a database password directly in server.js. Database credentials should be moved to environment variables before deployment.

## Authentication

Authentication is intentionally NOT part of this integration pass.

The existing sign-in page remains as-is unless a connection absolutely requires a small supporting change.

Later the intended flow can be:

    Frontend → Auth API → auth middleware → protected routes → MySQL

## Where to work

| Feature | Start here | Backend/data |
|---|---|---|
| Main website | index.html + Main/ | Mostly static currently |
| Dashboard | Main/dashboard.html | Static currently |
| Canteen | canteen/ | backend/server.js → MySQL |
| Lost & Found | lost_and_found/ | PHP pages → MySQL |
| Backend | backend/server.js | MySQL + food image storage |

## Team rule

- Frontend changes go in the feature's existing frontend folder.
- Canteen API work goes in backend/server.js for now.
- Lost & Found DB work stays with the existing PHP module until its backend is deliberately migrated.
- Do not create a second implementation of the same feature.
- Do not redesign a feature while fixing its connection.
- Do not commit real database passwords.
- Do not implement authentication in this pass.

## Target

    Same UI
       ↓
    Same user experience
       ↓
    Correct page links
       ↓
    Correct API/database connections
       ↓
    No duplicate feature implementations
       ↓
    Authentication later

## Current blocker

The repository does not contain config/database.php, so the exact PHP-to-MySQL connection cannot be safely verified from GitHub alone. The database schema is also not committed.

Before changing that part, provide the actual database schema/connection configuration (without sharing passwords). The minimum useful output is:

    SHOW TABLES;
    DESCRIBE lost_items;
    DESCRIBE found_items;

Then the Lost & Found connection can be completed without guessing.