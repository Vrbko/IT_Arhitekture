-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS autodeli;

-- Use the newly created or existing database
USE autodeli;

-- Create the orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_name VARCHAR(100) NOT NULL,
    part_no VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending'
);

-- Create the user 'vrbko' with a password
-- Ensure the user can connect from any host '%' and authenticate using caching_sha2_password
CREATE USER IF NOT EXISTS 'vrbko'@'%' IDENTIFIED WITH mysql_native_password BY 'vrbko';
-- Grant all privileges to the 'vrbko' user on the 'autodeli' database
GRANT ALL PRIVILEGES ON autodeli.* TO 'vrbko'@'%';

-- Apply the privilege changes
FLUSH PRIVILEGES;