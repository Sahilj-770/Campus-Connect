-- CampusConnect v2 Auth & Account Schema Migration
-- Non-destructive: preserves all existing data and tables.
-- Safe to run multiple times.

-- 1. USERS PROFILE TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    firebase_uid VARCHAR(128) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) DEFAULT NULL,
    full_name VARCHAR(100) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    department VARCHAR(100) DEFAULT NULL,
    roll_number VARCHAR(50) DEFAULT NULL,
    year VARCHAR(20) DEFAULT NULL,
    division VARCHAR(20) DEFAULT NULL,
    avatar_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_firebase_uid (firebase_uid),
    KEY idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. ORDERS TABLE USER OWNERSHIP (Nullable: retains unauthenticated legacy orders)
SET @dbname = DATABASE();
SET @tablename = "orders";
SET @columnname = "user_uid";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE `", @tablename, "` ADD COLUMN `", @columnname, "` VARCHAR(128) DEFAULT NULL AFTER `id`, ADD INDEX idx_orders_user_uid (`", @columnname, "`);")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 3. FOOD FAVOURITES TABLE USER OWNERSHIP (Nullable: retains guest favourites)
SET @tablename = "food_favourites";
SET @columnname = "user_uid";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE `", @tablename, "` ADD COLUMN `", @columnname, "` VARCHAR(128) DEFAULT NULL, ADD INDEX idx_fav_user_uid (`", @columnname, "`);")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 4. LOST ITEMS USER OWNERSHIP (Nullable: retains legacy anonymous lost items)
SET @tablename = "lost_items";
SET @columnname = "user_uid";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE `", @tablename, "` ADD COLUMN `", @columnname, "` VARCHAR(128) DEFAULT NULL, ADD INDEX idx_lost_user_uid (`", @columnname, "`);")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 5. FOUND ITEMS USER OWNERSHIP (Nullable: retains legacy anonymous found items)
SET @tablename = "found_items";
SET @columnname = "user_uid";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE `", @tablename, "` ADD COLUMN `", @columnname, "` VARCHAR(128) DEFAULT NULL, ADD INDEX idx_found_user_uid (`", @columnname, "`);")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;
