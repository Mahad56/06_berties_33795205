// Create a new router
const express = require("express")
const router = express.Router()

// Home page
router.get('/', function (req, res) {
    res.render('index', { shopData: req.app.locals.shopData })
})

// About page
router.get('/about', function (req, res) {
    res.render('about', { shopData: req.app.locals.shopData })
})

// Export the router
module.exports = router
