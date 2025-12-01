const express = require("express");
const router = express.Router();

router.get("/books", (req, res, next) => {

    let search = req.query.search;
    let min = req.query.minprice;
    let max = req.query.maxprice;
    let sort = req.query.sort;

    let sqlquery = "SELECT * FROM books";
    let params = [];

    // SEARCH extension
    if (search) {
        sqlquery = "SELECT * FROM books WHERE name LIKE ?";
        params = [`%${search}%`];
    }

    // PRICE RANGE extension
    if (min && max) {
        sqlquery = "SELECT * FROM books WHERE price BETWEEN ? AND ?";
        params = [min, max];
    }

    // SORT extension
    if (sort === "name") {
        sqlquery += " ORDER BY name ASC";
    }
    if (sort === "price") {
        sqlquery += " ORDER BY price ASC";
    }

    db.query(sqlquery, params, (err, result) => {
        if (err) {
            res.json(err);
            return next(err);
        }
        res.json(result);
    });
});

module.exports = router;
