
# Berties Books
Bertie’s Books – Lab 6 Submission Summary

This coursework implements the Bertie’s Books web application using Node.js, Express, EJS and MySQL.
The aim was to create a simple book shop system that can add, list and search books stored in a MySQL database, and deploy it to the Goldsmiths student server.

Features used

MySQL database created (berties_books)
books table created with id, name, price fields
Test data inserted
Node.js app connected to MySQL
List all books page
Search books page and search results
Add new book form and insert into database
Navigation between pages
Styled pages (improved UI)
Deployed application to Goldsmiths VM server
Application runs on server using pm2
Database Setup

Commands used:

CREATE DATABASE berties_books;
USE berties_books;
CREATE TABLE books (id INT AUTO_INCREMENT, name VARCHAR(50), price DECIMAL(5,2), PRIMARY KEY(id));
INSERT INTO books (name, price) VALUES (...);


Deployment on VM:

sudo mysql
source create_db.sql;
source insert_test_data.sql;

Key Routes
Route	Description
/	Home page
/books/list	Display all books
/books/add	Add a new book
/books/search	Search books
/books/search-result	Display search results

How to Run (Local)
npm install
node index.js
http://localhost:8000

How to Run (VM)
git clone <repo>
cd berties-books
npm install
sudo mysql
source create_db.sql;
source insert_test_data.sql;
pm2 start index.js --name berties-books

Repository

https://github.com/Mahad56/berties-books

Live URL

http://doc.gold.ac.uk/usr/183
