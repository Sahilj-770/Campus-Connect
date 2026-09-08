Campus Bites 🍽️

Campus Bites is a campus food discovery website designed to help students easily explore campus canteens and find food during lecture breaks.

✨ Features
🏫 Explore different campus canteens
🍴 Browse menus from each canteen
🔎 Search for food items
🗂️ Filter food items by category
❤️ Save favourite canteens
🟢 Check canteen opening/closing status
💰 View food prices
📋 View food availability and descriptions
📱 Responsive design for different screen sizes
🗄️ Menu data fetched from a MySQL database
⚡ Node.js + Express.js backend API
🏪 Available Canteens

The website currently includes:

Cafeteria – Meals, snacks and beverages
Timeless – Coffee, snacks and study breaks
Nescafe – Drinks and quick bites
🛠️ Technologies Used
Frontend
HTML5
CSS3
JavaScript
Backend
Node.js
Express.js
CORS
Database
MySQL
📁 Project Structure
Campus-Connect/
│
├── index.html
├── canteens.html
├── menu.html
│
├── css/
│   ├── main.css
│   ├── home.css
│   ├── canteens.css
│   ├── menu.css
│   └── responsive.css
│
├── js/
│   ├── canteens.js
│   └── menu.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
└── images/
    └── gradient.jpg
🔄 How It Works
Student
   ↓
Campus Bites Website
   ↓
Select Canteen
   ↓
Request Menu
   ↓
Node.js / Express Backend
   ↓
MySQL Database
   ↓
Menu Items
   ↓
Displayed on Website
🚀 How to Run the Project
1. Clone the repository
git clone <repository-url>
2. Open the project
cd Campus-Connect
3. Install backend dependencies
cd backend
npm install
4. Start the backend server
node server.js

The backend will run on:

http://localhost:3000
5. Open the website

Open index.html in your browser.

Make sure the MySQL server is running before loading the menu pages.

🗄️ Database

The project uses a MySQL database named:

campusconnect

The menu data is stored in separate tables for the available canteens.

The backend provides an API for retrieving menu data:

/api/menu/cafeteria
/api/menu/timeless
/api/menu/nescafe
🎯 Project Goal

The goal of Campus Bites is to make campus food discovery simple, quick and convenient for students, while providing a foundation for future features such as ratings, reviews, personalized recommendations and expanded campus services.

👨‍💻 Project

Campus-Connect / Campus Bites

Developed as a student web development project using frontend, backend and database technologies.