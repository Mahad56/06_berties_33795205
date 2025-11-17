// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = global.db
const saltRounds = 10

// Registration form
router.get('/register', function (req, res) {
    res.render('register', { shopData: req.app.locals.shopData })
})

// Registration submit
router.post('/registered', function (req, res, next) {

    const first = req.body.first
    const last = req.body.last
    const email = req.body.email
    const username = req.body.username
    const plainPassword = req.body.password

    // Hash password
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        if (err) return next(err)

        // Insert user into database
        const sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)"

        db.query(sqlquery, [username, first, last, email, hashedPassword], (err, result) => {
            if (err) return next(err)

            let output = `Hello ${first} ${last}, you are now registered! `
            output += `We will send an email to you at ${email}<br><br>`
            output += `Your password is: ${plainPassword}<br>`
            output += `Your hashed password is: ${hashedPassword}`

            res.send(output)
        })
    })
})

// List users (NO passwords shown)
router.get('/list', function (req, res, next) {
    const sqlquery = "SELECT username, first, last, email FROM users"
    db.query(sqlquery, (err, result) => {
        if (err) return next(err)
        res.render("users/list", { users: result })
    })
})

// Login form
router.get('/login', function (req, res) {
    res.render('users/login')
})

// Login processing
router.post('/loggedin', function (req, res, next) {

    const username = req.body.username
    const password = req.body.password

    const sqlquery = "SELECT * FROM users WHERE username = ?"
    db.query(sqlquery, [username], (err, result) => {
        if (err) return next(err)

        if (result.length === 0) {
            return res.send("Login failed: Username does not exist.")
        }

        const hashedPassword = result[0].hashedPassword

        // Compare password
        bcrypt.compare(password, hashedPassword, function (err, match) {
            if (err) return next(err)

            if (match === true) {
                res.send(`Login successful! Welcome back, ${username}.`)
            } else {
                res.send("Login failed: Incorrect password.")
            }
        })
    })
})

module.exports = router
