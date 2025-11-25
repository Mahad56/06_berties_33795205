require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const path = require("path");
const mysql = require("mysql2");
const session = require("express-session");
const expressSanitizer = require("express-sanitizer");

// Create the express application object
const app = express();
const port = process.env.PORT || 8000;

// Define the database connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
global.db = db;

// EJS templating
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser
app.use(express.urlencoded({ extended: true }));

// Sanitiser (REQUIRED FOR LAB 8B)
app.use(expressSanitizer());

// Sessions (REQUIRED FOR LAB 8A)
app.use(
  session({
    secret: "somerandomstuff",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }, // 10 minutes
  })
);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// App-specific data
app.locals.shopData = { shopName: "Bertie's Books" };

// Routes
app.use("/", require("./routes/main"));
app.use("/users", require("./routes/users"));
app.use("/books", require("./routes/books"));
app.use("/audit", require("./routes/audit"));

// Start server
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
