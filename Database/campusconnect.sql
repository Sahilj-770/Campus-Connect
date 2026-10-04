-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Oct 04, 2026 at 07:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `campusconnect`
--

-- --------------------------------------------------------

--
-- Table structure for table `cafe_timeless`
--

CREATE TABLE `cafe_timeless` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `availability` varchar(20) DEFAULT 'Available',
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cafe_timeless`
--

INSERT INTO `cafe_timeless` (`item_id`, `item_name`, `category`, `price`, `availability`, `description`) VALUES
(1, 'Poha', 'Breakfast', 30.00, 'Available', 'Fresh poha'),
(2, 'Samosa', 'Snacks', 20.00, 'Available', 'Crispy samosa'),
(3, 'Veg Puff', 'Snacks', 25.00, 'Available', 'Fresh vegetable puff'),
(4, 'Bhel', 'Snacks', 50.00, 'Available', 'Fresh bhel'),
(5, 'Veg Cheese Sandwich', 'Sandwich', 50.00, 'Available', 'Vegetable cheese sandwich'),
(6, 'Cheese Corn Sandwich', 'Sandwich', 60.00, 'Available', 'Cheese corn sandwich'),
(7, 'Veg Burger', 'Burger', 60.00, 'Available', 'Vegetable burger'),
(8, 'Chai', 'Beverages', 10.00, 'Available', 'Hot chai'),
(9, 'Coffee', 'Beverages', 20.00, 'Available', 'Hot coffee'),
(10, 'Cold Coffee', 'Beverages', 40.00, 'Available', 'Chilled cold coffee'),
(11, 'Maggi', 'Noodles', 40.00, 'Available', 'Hot Maggi');

-- --------------------------------------------------------

--
-- Table structure for table `campus_cafeteria`
--

CREATE TABLE `campus_cafeteria` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `availability` varchar(20) DEFAULT 'Available',
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `campus_cafeteria`
--

INSERT INTO `campus_cafeteria` (`item_id`, `item_name`, `category`, `price`, `availability`, `description`) VALUES
(1, 'Poha', 'Breakfast', 25.00, 'Available', 'Fresh poha'),
(2, 'Upma', 'Breakfast', 25.00, 'Available', 'Fresh upma'),
(3, 'Idli Sambar', 'Breakfast', 40.00, 'Available', 'Idli served with sambar'),
(4, 'Medu Vada', 'Breakfast', 50.00, 'Available', 'South Indian medu vada'),
(5, 'Misal Pav', 'Breakfast', 60.00, 'Available', 'Maharashtrian misal pav'),
(6, 'Pav Bhaji', 'Breakfast', 70.00, 'Available', 'Pav with bhaji'),
(7, 'Batata Vada', 'Breakfast', 15.00, 'Available', 'Potato fritter'),
(8, 'Sabu Khichadi', 'Breakfast', 40.00, 'Available', 'Sabudana khichadi'),
(9, 'Sabudana Vada', 'Breakfast', 40.00, 'Available', 'Crispy sabudana vada'),
(10, 'Samosa', 'Breakfast', 20.00, 'Available', 'Crispy samosa'),
(11, 'Vada Pav', 'Breakfast', 25.00, 'Available', 'Vada pav'),
(12, 'Bread Pattice', 'Breakfast', 50.00, 'Available', 'Bread pattice'),
(13, 'Batata Bhajji', 'Breakfast', 50.00, 'Available', 'Potato bhajji'),
(14, 'Kanda Bhajji', 'Breakfast', 30.00, 'Available', 'Onion bhajji'),
(15, 'Chole Bhature', 'Breakfast', 50.00, 'Available', 'Chole with bhature'),
(16, 'Veg Fried Rice', 'Chinese', 85.00, 'Available', 'Vegetable fried rice'),
(17, 'Veg Sez. Rice', 'Chinese', 95.00, 'Available', 'Vegetable Schezwan rice'),
(18, 'Veg Tripple Rice', 'Chinese', 130.00, 'Available', 'Vegetable triple rice'),
(19, 'Veg Hakka Noodles', 'Chinese', 85.00, 'Available', 'Vegetable hakka noodles'),
(20, 'Veg Sez. Noodles', 'Chinese', 95.00, 'Available', 'Vegetable Schezwan noodles'),
(21, 'Veg Tripple Noodles', 'Chinese', 130.00, 'Available', 'Vegetable triple noodles'),
(22, 'White Sauce', 'Pasta', 110.00, 'Available', 'White sauce pasta'),
(23, 'Mix Sauce', 'Pasta', 110.00, 'Available', 'Mixed sauce pasta'),
(24, 'Red Sauce', 'Pasta', 110.00, 'Available', 'Red sauce pasta'),
(25, 'Paneer', 'Pasta', 110.00, 'Available', 'Paneer pasta'),
(26, 'Plain Dosa', 'South Indian', 50.00, 'Available', 'Plain dosa'),
(27, 'Masala Dosa', 'South Indian', 60.00, 'Available', 'Masala dosa'),
(28, 'Cut Dosa', 'South Indian', 60.00, 'Available', 'Cut dosa'),
(29, 'Butter Dosa', 'South Indian', 75.00, 'Available', 'Butter dosa'),
(30, 'Paneer Dosa', 'South Indian', 85.00, 'Available', 'Paneer dosa'),
(31, 'Cheese Dosa', 'South Indian', 85.00, 'Available', 'Cheese dosa'),
(32, 'Schezwan Dosa', 'South Indian', 75.00, 'Available', 'Schezwan dosa'),
(33, 'Mysore Dosa', 'South Indian', 75.00, 'Available', 'Mysore dosa'),
(34, 'Plain Uttapa', 'South Indian', 60.00, 'Available', 'Plain uttapa'),
(35, 'Onion Uttapa', 'South Indian', 70.00, 'Available', 'Onion uttapa'),
(36, 'Masala Uttapa', 'South Indian', 75.00, 'Available', 'Masala uttapa'),
(37, 'Tomato Uttapa', 'South Indian', 70.00, 'Available', 'Tomato uttapa'),
(38, 'Tomato Onion Uttapa', 'South Indian', 75.00, 'Available', 'Tomato onion uttapa'),
(39, 'Chapati', 'Chapati / Paratha', 10.00, 'Available', 'Plain chapati'),
(40, 'Lachha Paratha', 'Chapati / Paratha', 15.00, 'Available', 'Lachha paratha'),
(41, 'Gobi Paratha', 'Chapati / Paratha', 55.00, 'Available', 'Gobi paratha'),
(42, 'Aloo Paratha', 'Chapati / Paratha', 65.00, 'Available', 'Aloo paratha'),
(43, 'Aloo Pyaz Paratha', 'Chapati / Paratha', 70.00, 'Available', 'Aloo onion paratha'),
(44, 'Paneer Paratha', 'Chapati / Paratha', 80.00, 'Available', 'Paneer paratha'),
(45, 'Veg Paratha', 'Chapati / Paratha', 70.00, 'Available', 'Vegetable paratha'),
(46, 'Mix Veg Paratha', 'Chapati / Paratha', 75.00, 'Available', 'Mixed vegetable paratha'),
(47, 'Veg Thali + Chapati', 'Thali', 90.00, 'Available', 'Vegetable thali with chapati'),
(48, 'Veg Thali + Roti', 'Thali', 90.00, 'Available', 'Vegetable thali with roti'),
(49, 'Paneer Thali', 'Thali', 150.00, 'Available', 'Paneer thali'),
(50, 'Shevbhaji Thali', 'Thali', 130.00, 'Available', 'Shev bhaji thali'),
(51, 'Chapati Bhaji', 'Thali', 60.00, 'Available', 'Chapati with bhaji'),
(52, 'Bhel', 'Chat', 45.00, 'Available', 'Bhel'),
(53, 'Bhel Puri', 'Chat', 55.00, 'Available', 'Bhel puri'),
(54, 'Pani Puri', 'Chat', 35.00, 'Available', 'Pani puri'),
(55, 'Masala Puri', 'Chat', 35.00, 'Available', 'Masala puri'),
(56, 'Shev Puri', 'Chat', 55.00, 'Available', 'Shev puri'),
(57, 'Dahi Puri', 'Chat', 55.00, 'Available', 'Dahi puri'),
(58, 'S.P.D.P.', 'Chat', 55.00, 'Available', 'Special dahi puri'),
(59, 'Ragda Puri', 'Chat', 55.00, 'Available', 'Ragda puri'),
(60, 'Samosa Chat', 'Chat', 55.00, 'Available', 'Samosa chat'),
(61, 'Papdi Chat', 'Chat', 55.00, 'Available', 'Papdi chat'),
(62, 'Aloo Tikki Chat', 'Chat', 70.00, 'Available', 'Aloo tikki chat'),
(63, 'Basket Chat', 'Chat', 80.00, 'Available', 'Basket chat'),
(64, 'Dahi Vada', 'Chat', 70.00, 'Available', 'Dahi vada'),
(65, 'Veg Sandwich', 'Sandwich', 40.00, 'Available', 'Vegetable sandwich'),
(66, 'Veg Cheese Sandwich', 'Sandwich', 50.00, 'Available', 'Veg cheese sandwich'),
(67, 'Paneer Sandwich', 'Sandwich', 60.00, 'Available', 'Paneer sandwich'),
(68, 'Paneer Cheese Sandwich', 'Sandwich', 70.00, 'Available', 'Paneer cheese sandwich'),
(69, 'Corn Sandwich', 'Sandwich', 60.00, 'Available', 'Corn sandwich'),
(70, 'Corn Cheese Sandwich', 'Sandwich', 70.00, 'Available', 'Corn cheese sandwich'),
(71, 'Veg Club Sandwich', 'Sandwich', 70.00, 'Available', 'Veg club sandwich'),
(72, 'Bombay Masala', 'Sandwich', 50.00, 'Available', 'Bombay masala sandwich'),
(73, 'Bombay Masala Cheese', 'Sandwich', 60.00, 'Available', 'Bombay masala cheese sandwich'),
(74, 'Bread Butter', 'Sandwich', 30.00, 'Available', 'Bread butter'),
(75, 'Bread Butter Jam', 'Sandwich', 40.00, 'Available', 'Bread butter jam'),
(76, 'Veg Biryani', 'Rice', 80.00, 'Available', 'Vegetable biryani'),
(77, 'Veg Pulao', 'Rice', 60.00, 'Available', 'Vegetable pulao'),
(78, 'Paneer Pulao', 'Rice', 90.00, 'Available', 'Paneer pulao'),
(79, 'Steam Rice', 'Rice', 50.00, 'Available', 'Steamed rice'),
(80, 'Jeera Rice', 'Rice', 60.00, 'Available', 'Jeera rice'),
(81, 'Dal Khichdi', 'Rice', 70.00, 'Available', 'Dal khichdi'),
(82, 'Dal Khichdi Tadka', 'Rice', 80.00, 'Available', 'Dal khichdi with tadka'),
(83, 'Curd Rice', 'Rice', 60.00, 'Available', 'Curd rice'),
(84, 'Piece Pulao', 'Rice', 90.00, 'Available', 'Piece pulao'),
(85, 'DY Special Biryani', 'Rice', 150.00, 'Available', 'DY special biryani'),
(86, 'Paneer Masala', 'Punjabi Dishes', 100.00, 'Available', 'Paneer masala'),
(87, 'Paneer Tikka Masala', 'Punjabi Dishes', 110.00, 'Available', 'Paneer tikka masala'),
(88, 'Paneer Lahori Masala', 'Punjabi Dishes', 110.00, 'Available', 'Paneer Lahori masala'),
(89, 'Paneer Kolhapuri', 'Punjabi Dishes', 100.00, 'Available', 'Paneer Kolhapuri'),
(90, 'Paneer Tufani', 'Punjabi Dishes', 110.00, 'Available', 'Paneer Tufani'),
(91, 'Paneer Rajwadi', 'Punjabi Dishes', 110.00, 'Available', 'Paneer Rajwadi'),
(92, 'Paneer Navabi', 'Punjabi Dishes', 110.00, 'Available', 'Paneer Navabi'),
(93, 'Paneer Bhurji', 'Punjabi Dishes', 90.00, 'Available', 'Paneer bhurji'),
(94, 'Muttor Paneer Masala', 'Punjabi Dishes', 100.00, 'Available', 'Mutter paneer masala'),
(95, 'Veg Kolhapuri', 'Punjabi Dishes', 90.00, 'Available', 'Veg Kolhapuri'),
(96, 'Mix Veg', 'Punjabi Dishes', 90.00, 'Available', 'Mixed vegetables'),
(97, 'Veg Maratha', 'Punjabi Dishes', 90.00, 'Available', 'Veg Maratha'),
(98, 'Veg Bhoona', 'Punjabi Dishes', 90.00, 'Available', 'Veg bhoona'),
(99, 'Veg Patiala', 'Punjabi Dishes', 90.00, 'Available', 'Veg Patiala'),
(100, 'Lasooni Palak', 'Punjabi Dishes', 100.00, 'Available', 'Lasooni palak'),
(101, 'Dal Palak', 'Punjabi Dishes', 80.00, 'Available', 'Dal palak'),
(102, 'Aloo Palak', 'Punjabi Dishes', 70.00, 'Available', 'Aloo palak'),
(103, 'Dal Fry', 'Punjabi Dishes', 70.00, 'Available', 'Dal fry'),
(104, 'Dal Tadka', 'Punjabi Dishes', 80.00, 'Available', 'Dal tadka'),
(105, 'Dal Kolhapuri', 'Punjabi Dishes', 80.00, 'Available', 'Dal Kolhapuri'),
(106, 'Aloo Jeera', 'Punjabi Dishes', 70.00, 'Available', 'Aloo jeera'),
(107, 'Baingan Masala', 'Punjabi Dishes', 70.00, 'Available', 'Baingan masala'),
(108, 'Chole Masala', 'Punjabi Dishes', 70.00, 'Available', 'Chole masala'),
(109, 'Bhendi Masala', 'Punjabi Dishes', 90.00, 'Available', 'Bhendi masala'),
(110, 'Gobi Masala', 'Punjabi Dishes', 90.00, 'Available', 'Gobi masala'),
(111, 'Green Piece Masala', 'Punjabi Dishes', 80.00, 'Available', 'Green peas masala'),
(112, 'Plain Maggi', 'Maggi', 40.00, 'Available', 'Plain Maggi'),
(113, 'Masala Maggi', 'Maggi', 45.00, 'Available', 'Masala Maggi'),
(114, 'Cheese Maggi', 'Maggi', 60.00, 'Available', 'Cheese Maggi'),
(115, 'Butter Maggi', 'Maggi', 60.00, 'Available', 'Butter Maggi'),
(116, 'Paneer Maggi', 'Maggi', 60.00, 'Available', 'Paneer Maggi'),
(117, 'Peri Peri Maggi', 'Maggi', 60.00, 'Available', 'Peri peri Maggi'),
(118, 'Cold Coffee', 'Cold Beverages', 40.00, 'Available', 'Cold coffee'),
(119, 'Cold Bournvita', 'Cold Beverages', 45.00, 'Available', 'Cold Bournvita'),
(120, 'Cold Chocolate', 'Cold Beverages', 45.00, 'Available', 'Cold chocolate'),
(121, 'Cold Drinks', 'Cold Beverages', 20.00, 'Available', 'Cold drink'),
(122, 'Mineral Water', 'Cold Beverages', 20.00, 'Available', 'Mineral water'),
(123, 'Ice-Cream', 'Cold Beverages', 25.00, 'Available', 'Ice cream'),
(124, 'Tea', 'Hot Beverages', 15.00, 'Available', 'Hot tea'),
(125, 'Black Tea', 'Hot Beverages', 20.00, 'Available', 'Black tea'),
(126, 'Green Tea', 'Hot Beverages', 20.00, 'Available', 'Green tea'),
(127, 'Hot Coffee', 'Hot Beverages', 25.00, 'Available', 'Hot coffee'),
(128, 'Hot Bournvita', 'Hot Beverages', 30.00, 'Available', 'Hot Bournvita'),
(129, 'Hot Chocolate', 'Hot Beverages', 40.00, 'Available', 'Hot chocolate'),
(130, 'Strawberry Milkshake', 'Milkshake', 60.00, 'Available', 'Strawberry milkshake'),
(131, 'Rose Milkshake', 'Milkshake', 60.00, 'Available', 'Rose milkshake');

-- --------------------------------------------------------

--
-- Table structure for table `found_items`
--

CREATE TABLE `found_items` (
  `serial_number` int(11) NOT NULL,
  `roll_number` varchar(11) DEFAULT NULL,
  `item_name` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `status` varchar(20) DEFAULT 'Found',
  `person_name` varchar(100) DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `found_items`
--

INSERT INTO `found_items` (`serial_number`, `roll_number`, `item_name`, `location`, `status`, `person_name`, `contact_number`, `description`, `image`) VALUES
(1, 'SYCO2627C00', 'College ID Card', 'Canteen', 'found', 'Pranav Bhosale', '9000002001', 'College ID card found near the canteen entrance.', NULL),
(2, 'SYCO2627C01', 'Blue Water Bottle', 'Classroom 105', 'found', 'Harsh Vaidya', '9000002002', 'Blue reusable water bottle left on a classroom desk.', NULL),
(3, 'SYCO2627C01', 'Calculator', 'Library', 'found', 'Manas Chavan', '9000002003', 'Casio scientific calculator found near the study tables.', NULL),
(4, 'SYCO2627C02', 'Black Backpack', 'Computer Lab', 'found', 'Tanmay Shinde', '9000002004', 'Black college backpack containing notebooks.', NULL),
(5, 'TYCO2526C00', 'Earbuds Case', 'Sports Ground', 'found', 'Akshay Wagh', '9000002005', 'Black wireless earbuds charging case.', NULL),
(6, 'TYCO2526C01', 'Notebook', 'Seminar Hall', 'found', 'Soham Pawar', '9000002006', 'Green notebook containing engineering lecture notes.', NULL),
(7, 'FYCO2627C01', 'Keychain', 'Parking Area', 'found', 'Ananya Joshi', '9000002007', 'Metal keychain with three keys attached.', NULL),
(8, 'FYCO2627C02', 'Spectacles Case', 'Cafeteria', 'found', 'Riya Deshpande', '9000002008', 'Black spectacles case found under a cafeteria table.', NULL),
(9, 'FYCO2627C03', 'USB Drive', 'Computer Lab', 'found', 'Aditi Kulkarni', '9000002009', 'Small silver USB flash drive found near a computer.', NULL),
(10, 'FYCO2627C03', 'Umbrella', 'Main Building', 'found', 'Vivek Joshi', '9000002010', 'Black umbrella found near the building entrance.', NULL),
(11, 'N/A', 'Chemistry Lab Journal', 'Chemistry Lab', 'found', 'Campus Student', 'N/A', 'Green in colour', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNj');

-- --------------------------------------------------------

--
-- Table structure for table `lost_items`
--

CREATE TABLE `lost_items` (
  `serial_number` int(11) NOT NULL,
  `roll_number` varchar(20) DEFAULT NULL,
  `item_name` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `person_name` varchar(100) DEFAULT NULL,
  `contact_number` varchar(15) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lost_items`
--

INSERT INTO `lost_items` (`serial_number`, `roll_number`, `item_name`, `location`, `description`, `status`, `person_name`, `contact_number`, `image`) VALUES
(1, 'SYCO2627B012', 'College ID Card', 'Library', 'College identity card in a transparent plastic holder.', 'lost', 'Aarav Kulkarni', '9000001001', 'uploads/items/collegeidcard.jpg'),
(2, 'SYCO2627B018', 'Black Wallet', 'Canteen', 'Black leather wallet containing college ID and some cash.', 'lost', 'Rohan Patil', '9000001002', 'uploads/items/blackwallet.jpg'),
(3, 'SYCO2627B023', 'Water Bottle', 'Sports Ground', 'Black stainless steel water bottle with a silver cap.', 'lost', 'Aditya Deshmukh', '9000001003', 'uploads/items/waterbottle.jpg'),
(4, 'SYCO2627B027', 'Scientific Calculator', 'Classroom 204', 'Casio scientific calculator used for engineering classes.', 'lost', 'Vedant Joshi', '9000001004', 'uploads/items/scientificcalculator.jpg'),
(5, 'SYCO2627B031', 'USB Drive', 'Computer Lab', 'Small black 32 GB USB flash drive.', 'lost', 'Kunal Shah', '9000001005', 'uploads/items/usbdrive.jpg'),
(6, 'TYCO2526B009', 'Earphones', 'Cafeteria', 'Black wired earphones kept in a small black pouch.', 'lost', 'Siddharth More', '9000001006', 'uploads/items/earphones.jpg'),
(7, 'TYCO2526B014', 'Notebook', 'Seminar Hall', 'Blue engineering mathematics notebook with handwritten notes.', 'lost', 'Omkar Jadhav', '9000001007', 'uploads/items/notebook.jpg'),
(8, 'TYCO2526B021', 'Laptop Charger', 'Library', 'Dell laptop charger with black cable.', 'lost', 'Yash Kulkarni', '9000001008', 'uploads/items/laptopcharger.jpg'),
(9, 'FYCO2627B016', 'Umbrella', 'Main Gate', 'Black folding umbrella with a curved handle.', 'lost', 'Ishita Desai', '9000001009', 'uploads/items/umbrella.jpg'),
(10, 'FYCO2627B024', 'Keychain', 'Parking Area', 'Small metal keychain with two keys attached.', 'lost', 'Neha Pawar', '9000001010', 'uploads/items/keychain.jpg'),
(11, 'N/A', 'Mobile', 'Smart store', 'Blue', 'lost', 'Campus Student', 'N/A', 'uploads/items/mobile.jpg'),
(12, 'N/A', 'Mobile', 'Hardware Lab', 'Blue in colour', 'lost', 'Campus Student', 'N/A', 'uploads/items/mobile.jpg'),
(13, 'N/A', 'Mobile Cover', 'Auditorium', 'Red', 'lost', 'Campus Student', 'N/A', 'uploads/items/mobilecover.jpg'),
(14, 'N/A', 'Lab File', 'SL-2', 'Yellow in colour', 'found', 'Campus Student', 'N/A', NULL),
(15, 'N/A', 'Geometry Box', 'Graphics lab', 'Orange', 'lost', 'Campus Student', 'N/A', NULL),
(16, 'N/A', 'pendrive', 'Square garden', 'red', 'lost', 'Campus Student', 'N/A', 'uploads/items/usbdrive.jpg'),
(17, 'N/A', 'wallet', 'cafetaria', 'black', 'lost', 'Campus Student', 'N/A', 'uploads/items/blackwallet.jpg'),
(18, 'N/A', 'Black Bag', 'Library', 'Black in colour', 'lost', 'Campus Student', 'N/A', NULL),
(19, 'N/A', 'bag', 'cafetaria', 'black', 'lost', 'Campus Student', 'N/A', 'uploads/items/blackbag_1790798817313.jpg'),
(20, 'N/A', 'Spectacles', 'Hardware Lab', 'It is of Lenskart Company', 'found', 'Campus Student', 'N/A', 'uploads/items/spectacles_1790846841290.jpg'),
(21, 'N/A', 'Pouch', 'Classroom 36', 'Orange in colour', 'lost', 'Campus Student', 'N/A', 'uploads/items/pouch_1790847147030.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `nescafe`
--

CREATE TABLE `nescafe` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(100) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `availability` varchar(20) DEFAULT 'Available',
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nescafe`
--

INSERT INTO `nescafe` (`item_id`, `item_name`, `category`, `price`, `availability`, `description`) VALUES
(1, 'Original Masala', 'Noodles', 40.00, 'Available', 'Original masala Maggi'),
(2, 'Capsicum Maggi', 'Noodles', 40.00, 'Available', 'Capsicum Maggi'),
(3, 'Double Masala Maggi', 'Noodles', 50.00, 'Available', 'Double masala Maggi'),
(4, 'Special Masala Maggi', 'Noodles', 60.00, 'Available', 'Special masala Maggi'),
(5, 'Peri Peri Maggi', 'Noodles', 60.00, 'Available', 'Peri peri Maggi'),
(6, 'Chilli Garlic Maggi', 'Noodles', 60.00, 'Available', 'Chilli garlic Maggi'),
(7, 'Garlic Butter Maggi', 'Noodles', 60.00, 'Available', 'Garlic butter Maggi'),
(8, 'BBQ Maggi', 'Noodles', 70.00, 'Available', 'BBQ Maggi'),
(9, 'Butter Double Masala Maggi', 'Noodles', 70.00, 'Available', 'Butter double masala Maggi'),
(10, 'Chilli Paneer Maggi', 'Noodles', 70.00, 'Available', 'Chilli paneer Maggi'),
(11, 'Manchurian Maggi', 'Noodles', 70.00, 'Available', 'Manchurian Maggi'),
(12, 'Vegetable Maggi', 'Noodles', 70.00, 'Available', 'Vegetable Maggi'),
(13, 'Korean BBQ Maggi', 'Noodles', 90.00, 'Available', 'Korean BBQ Maggi'),
(14, 'Oregano White Pasta', 'Pasta', 80.00, 'Available', 'Oregano white pasta'),
(15, 'Masala Penne', 'Pasta', 80.00, 'Available', 'Masala penne pasta'),
(16, 'Tomato Pasta', 'Pasta', 80.00, 'Available', 'Tomato pasta'),
(17, 'Coffee', 'Nescafe', 20.00, 'Available', 'Freshly brewed coffee'),
(18, 'Green Tea', 'Nescafe', 20.00, 'Available', 'Green tea'),
(19, 'Cardamom Tea', 'Nescafe', 20.00, 'Available', 'Cardamom tea'),
(20, 'Masala Tea', 'Nescafe', 20.00, 'Available', 'Masala tea'),
(21, 'Espresso', 'Nescafe', 30.00, 'Available', 'Espresso coffee'),
(22, 'Cappuccino', 'Nescafe', 50.00, 'Available', 'Cappuccino'),
(23, 'Cafe Latte', 'Nescafe', 50.00, 'Available', 'Cafe latte'),
(24, 'Americano', 'Nescafe', 50.00, 'Available', 'Americano coffee'),
(25, 'Irish Cappucino', 'Nescafe', 60.00, 'Available', 'Irish cappucino'),
(26, 'Caramel Cappuccino', 'Nescafe', 60.00, 'Available', 'Caramel cappuccino'),
(27, 'Hazelnut Cappuccino', 'Nescafe', 60.00, 'Available', 'Hazelnut cappuccino'),
(28, 'Ice Tea', 'Cold Beverages', 40.00, 'Available', 'Cold ice tea'),
(29, 'Mojito', 'Cold Beverages', 50.00, 'Available', 'Refreshing mojito'),
(30, 'Watermelon Ice Tea', 'Cold Beverages', 50.00, 'Available', 'Watermelon ice tea'),
(31, 'Peach Ice Tea', 'Cold Beverages', 50.00, 'Available', 'Peach ice tea'),
(32, 'Frappe', 'Cold Coffee', 60.00, 'Available', 'Cold frappe'),
(33, 'Frappe Mocha', 'Cold Coffee', 70.00, 'Available', 'Mocha frappe'),
(34, 'Cold Chocolate', 'Cold Coffee', 60.00, 'Available', 'Cold chocolate'),
(35, 'Irish Frappe', 'Cold Coffee', 70.00, 'Available', 'Irish frappe'),
(36, 'Caramel Frappe', 'Cold Coffee', 70.00, 'Available', 'Caramel frappe'),
(37, 'Strawberry Thick Shake', 'Thick Shake', 90.00, 'Available', 'Strawberry thick shake'),
(38, 'Blueberry Thick Shake', 'Thick Shake', 90.00, 'Available', 'Blueberry thick shake'),
(39, 'Kitkat Thick Shake', 'Thick Shake', 100.00, 'Available', 'Kitkat thick shake'),
(40, 'Nescafe Cold Thick Shake', 'Thick Shake', 100.00, 'Available', 'Nescafe cold thick shake'),
(41, 'Cheese', 'Extras', 20.00, 'Available', 'Extra cheese'),
(42, 'Butter', 'Extras', 20.00, 'Available', 'Extra butter'),
(43, 'Vegetables', 'Extras', 20.00, 'Available', 'Extra vegetables'),
(44, 'Sauces', 'Extras', 20.00, 'Available', 'Extra sauces'),
(45, 'Veg Puff', 'Baked Bliss', 25.00, 'Available', 'Vegetable puff'),
(46, 'Paneer Puff', 'Baked Bliss', 30.00, 'Available', 'Paneer puff'),
(47, 'BlackForest Pastry', 'Baked Bliss', 70.00, 'Available', 'Black Forest pastry'),
(48, 'MixFruit Pastry', 'Baked Bliss', 70.00, 'Available', 'Mixed fruit pastry'),
(49, 'Chocolate Truffle', 'Baked Bliss', 70.00, 'Available', 'Chocolate truffle pastry'),
(50, 'Chocochip Pastry', 'Baked Bliss', 70.00, 'Available', 'Chocolate chip pastry'),
(51, 'Belgium Truffle', 'Baked Bliss', 120.00, 'Available', 'Belgium truffle'),
(52, 'Bread Butter Toast', 'Sandwich', 40.00, 'Available', 'Bread butter toast'),
(53, 'Cheese Chutney S/W', 'Sandwich', 50.00, 'Available', 'Cheese chutney sandwich'),
(54, 'Vegetable Grilled S/W', 'Sandwich', 60.00, 'Available', 'Vegetable grilled sandwich'),
(55, 'Cheese Corn Grilled Sandwich', 'Sandwich', 70.00, 'Available', 'Cheese corn grilled sandwich'),
(56, 'Paneer Tikka Sandwich', 'Sandwich', 80.00, 'Available', 'Paneer tikka sandwich'),
(57, 'Spicy Peri Peri Sandwich', 'Sandwich', 80.00, 'Available', 'Spicy peri peri sandwich'),
(58, 'Chicken Tikka S/W', 'Sandwich', 100.00, 'Available', 'Chicken tikka sandwich'),
(59, 'Chicken Mayo SW', 'Sandwich', 110.00, 'Available', 'Chicken mayo sandwich'),
(60, 'Peanut Butter S/W', 'Sandwich', 50.00, 'Available', 'Peanut butter sandwich'),
(61, 'Cheese Garlic Bread', 'Sandwich', 80.00, 'Available', 'Cheese garlic bread'),
(62, 'Tandoori Paneer Garlic Bread', 'Sandwich', 100.00, 'Available', 'Tandoori paneer garlic bread'),
(63, 'Super Veg Burger', 'Burger', 80.00, 'Available', 'Super veg burger'),
(64, 'Herb Chilli Burger', 'Burger', 90.00, 'Available', 'Herb chilli burger'),
(65, 'Cheesy Jalapenos Burger', 'Burger', 120.00, 'Available', 'Cheesy jalapenos burger'),
(66, 'Spicy Paneer Burger', 'Burger', 140.00, 'Available', 'Spicy paneer burger'),
(67, 'Chicken Burger', 'Burger', 100.00, 'Available', 'Chicken burger'),
(68, 'Chicken Spicy Burger', 'Burger', 120.00, 'Available', 'Chicken spicy burger'),
(69, 'Salted Fries', 'Crispy Creations', 70.00, 'Available', 'Salted fries'),
(70, 'Peri Peri Fries', 'Crispy Creations', 80.00, 'Available', 'Peri peri fries'),
(71, 'Cheesy Fries', 'Crispy Creations', 100.00, 'Available', 'Cheesy fries'),
(72, 'Cheese Corn Nugget', 'Crispy Creations', 90.00, 'Available', 'Cheese corn nuggets'),
(73, 'Chicken Nuggets', 'Crispy Creations', 90.00, 'Available', 'Chicken nuggets'),
(74, 'Mexican Potato Wedges', 'Crispy Creations', 100.00, 'Available', 'Mexican potato wedges'),
(75, 'Crispy Pizza Finger', 'Crispy Creations', 120.00, 'Available', 'Crispy pizza fingers'),
(76, 'Chicken Wings', 'Crispy Creations', 140.00, 'Available', 'Chicken wings'),
(77, 'Bread Omlette', 'Egg Stop', 50.00, 'Available', 'Bread omelette'),
(78, 'Egg Bhurji Sandwich', 'Egg Stop', 60.00, 'Available', 'Egg bhurji sandwich'),
(79, 'Spicy Paneer Wrap', 'Wrap', 100.00, 'Available', 'Spicy paneer wrap'),
(80, 'Corn Wrap', 'Wrap', 100.00, 'Available', 'Corn wrap'),
(81, 'Spicy BBQ Chicken Wrap', 'Wrap', 120.00, 'Available', 'Spicy BBQ chicken wrap');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cafe_timeless`
--
ALTER TABLE `cafe_timeless`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `campus_cafeteria`
--
ALTER TABLE `campus_cafeteria`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `found_items`
--
ALTER TABLE `found_items`
  ADD PRIMARY KEY (`serial_number`),
  ADD KEY `user_id` (`roll_number`);

--
-- Indexes for table `lost_items`
--
ALTER TABLE `lost_items`
  ADD PRIMARY KEY (`serial_number`),
  ADD KEY `user_id` (`roll_number`);

--
-- Indexes for table `nescafe`
--
ALTER TABLE `nescafe`
  ADD PRIMARY KEY (`item_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cafe_timeless`
--
ALTER TABLE `cafe_timeless`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `campus_cafeteria`
--
ALTER TABLE `campus_cafeteria`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT for table `found_items`
--
ALTER TABLE `found_items`
  MODIFY `serial_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `lost_items`
--
ALTER TABLE `lost_items`
  MODIFY `serial_number` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `nescafe`
--
ALTER TABLE `nescafe`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
