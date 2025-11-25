// Create a new router
const express = require("express")
const router = express.Router()

// Protect routes
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('./users/login')
    } else {
        next()
    }
}

// Home page
router.get('/', function (req, res) {
    res.render('index', { shopData: req.app.locals.shopData })
})

// About page
router.get('/about', function (req, res) {
    res.render('about', { shopData: req.app.locals.shopData })
})

// Logout (Lab 8 requirement)
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('./')
        }
        res.send('you are now logged out. <a href="./">Home</a>')
    })
})

// Export the router
module.exports = router
