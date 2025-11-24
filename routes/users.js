// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = global.db;
const saltRounds = 10;

// Registration form
router.get('/register', function (req, res) {
    res.render('register', { shopData: req.app.locals.shopData });
});

// Registration submit
router.post('/registered', function (req, res, next) {

    const { first, last, email, username, password: plainPassword } = req.body;

    // Hash password
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        if (err) return next(err);

        // Insert user into database
        const sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";

        db.query(sqlquery, [username, first, last, email, hashedPassword], (err, result) => {
            if (err) {
                // Handle duplicate user (username/email)
                if (err.code === "ER_DUP_ENTRY") {
                    db.query("INSERT INTO audit_log (action) VALUES (?)",
                        [`Failed registration (duplicate): ${username}`]);
                    return res.send("Registration failed: Username or email already exists.");
                }
                return next(err);
            }

            // Log successful registration
            db.query("INSERT INTO audit_log (action) VALUES (?)",
                [`User registered: ${username}`]);

            let output = `Hello ${first} ${last}, you are now registered!<br>`;
            output += `We will send an email to you at ${email}.<br>`;
            output += `Your account has been created successfully.`;

            res.send(output);
        });
    });
});

// List users (NO passwords shown)
router.get('/list', function (req, res, next) {
    const sqlquery = "SELECT username, first, last, email FROM users";
    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        res.render("users/list", { users: result });
    });
});

// Login form
router.get('/login', function (req, res) {
    res.render('users/login');
});

// Login processing
router.post('/loggedin', function (req, res, next) {

    const { username, password } = req.body;

    const sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, result) => {
        if (err) return next(err);

        if (result.length === 0) {
            // Log unknown user login attempt
            db.query("INSERT INTO audit_log (action) VALUES (?)",
                [`Failed login (unknown user): ${username}`]);

            return res.send("Login failed: Username does not exist.");
        }

        const hashedPassword = result[0].hashedPassword;

        // Compare password
        bcrypt.compare(password, hashedPassword, function (err, match) {
            if (err) return next(err);

            if (match === true) {
                // Log successful login
                db.query("INSERT INTO audit_log (action) VALUES (?)",
                    [`User logged in: ${username}`]);

                return res.send(`Login successful! Welcome back, ${username}.`);
            } else {
                // Log wrong password attempt
                db.query("INSERT INTO audit_log (action) VALUES (?)",
                    [`Failed login (wrong password): ${username}`]);

                return res.send("Login failed: Incorrect password.");
            }
        });
    });
});

module.exports = router;
