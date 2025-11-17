# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the tables
CREATE TABLE IF NOT EXISTS books (id INT AUTO_INCREMENT,name VARCHAR(50),price DECIMAL(5, 2) unsigned,PRIMARY KEY(id));

-- Create the application user
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'cary7878';
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  first VARCHAR(50),
  last VARCHAR(50),
  email VARCHAR(100),
  hashedPassword VARCHAR(255)
);
