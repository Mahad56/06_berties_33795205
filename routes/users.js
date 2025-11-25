// Create a new router
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = global.db;
const saltRounds = 10;
const { check, validationResult } = require("express-validator");


const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('../users/login');
    } else {
        next();
    }
};

// Registration form
router.get('/register', function (req, res) {
    res.render('register', { 
        shopData: req.app.locals.shopData,
        errors: []
    });
});


// Registration submit
router.post(
    '/registered',
    [
        check('email').isEmail().withMessage("Enter a valid email"),
        check('username').isLength({ min: 5, max: 20 }).withMessage("Username must be 5–20 characters"),
        check('password').isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    ],
    function (req, res, next) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('register', { 
                shopData: req.app.locals.shopData,
                errors: errors.array()
            });
        }
        const first = req.sanitize(req.body.first);
        const last = req.sanitize(req.body.last);
        const email = req.sanitize(req.body.email);
        const username = req.sanitize(req.body.username);
        const plainPassword = req.sanitize(req.body.password);


        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
            if (err) return next(err);

            const sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?, ?, ?, ?, ?)";

            db.query(sqlquery, [username, first, last, email, hashedPassword], (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        db.query("INSERT INTO audit_log (action) VALUES (?)",
                            [`Failed registration (duplicate): ${username}`]);
                        return res.send("Registration failed: Username or email already exists.");
                    }
                    return next(err);
                }

                db.query("INSERT INTO audit_log (action) VALUES (?)",
                    [`User registered: ${username}`]);

                let output = `Hello ${first} ${last}, you are now registered!<br>`;
                output += `We will send an email to you at ${email}.<br>`;
                output += `Your account has been created successfully.`;

                res.send(output);
            });
        });
    }
);

// PROTECTED: List users
router.get('/list', redirectLogin, function (req, res, next) {
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

    const username = req.sanitize(req.body.username);
    const password = req.sanitize(req.body.password);


    const sqlquery = "SELECT * FROM users WHERE username = ?";
    db.query(sqlquery, [username], (err, result) => {
        if (err) return next(err);

        if (result.length === 0) {
            db.query("INSERT INTO audit_log (action) VALUES (?)",
                [`Failed login (unknown user): ${username}`]);

            return res.send("Login failed: Username does not exist.");
        }

        const hashedPassword = result[0].hashedPassword;

        bcrypt.compare(password, hashedPassword, function (err, match) {
            if (err) return next(err);

            if (match === true) {

                // REQUIRED FOR LAB 8:
                req.session.userId = username;

                db.query("INSERT INTO audit_log (action) VALUES (?)",
                    [`User logged in: ${username}`]);

                return res.send(`Login successful! Welcome back, ${username}.`);
            } else {

                db.query("INSERT INTO audit_log (action) VALUES (?)",
                    [`Failed login (wrong password): ${username}`]);

                return res.send("Login failed: Incorrect password.");
            }
        });
    });
});

module.exports = router;
