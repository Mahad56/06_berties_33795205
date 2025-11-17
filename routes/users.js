// Create a new router
const express = require("express")
const router = express.Router()

// Register page
router.get('/register', function (req, res) {
    res.render('register', { shopData: req.app.locals.shopData })
})

// Register POST
router.post('/registered', function (req, res) {
    res.send('Hello ' + req.body.first + ' ' + req.body.last + 
             '! You are now registered. We will email you at ' + req.body.email)
})

// Export router
module.exports = router
