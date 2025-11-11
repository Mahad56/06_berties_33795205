// Create a new router
const express = require("express")
const router = express.Router()

//  List all books (EJS table instead of JSON)
router.get('/list', function(req, res, next) {
  const sqlquery = "SELECT * FROM books";
  db.query(sqlquery, (err, result) => {
    if (err) return next(err);
    res.render("books/list", { books: result });  // pass data to view
  });
});

// Search form
router.get('/search', function(req, res) {
  res.render("books/search");
});

//  Search database
router.get(['/search-result', '/search_result'], function (req, res, next) {
  const term = (req.query.keyword || req.query.search_text || '').trim();
  const sqlquery = "SELECT * FROM books WHERE name LIKE ?";
  
  db.query(sqlquery, [`%${term}%`], (err, result) => {
    if (err) return next(err);
    res.render("books/search_results", { books: result, term });
  });
});

//  Add Book form
router.get('/add', function(req, res) {
  res.render('books/add');
});

// Add Book submit
router.post('/add', function (req, res, next) {
  const name = req.body.name;
  const price = req.body.price;

  const sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
  db.query(sqlquery, [name, price], (err, result) => {
    if (err) return next(err);
    res.redirect('/books/list');
  });
});

// Delete by id
router.get('/delete/:id', function (req, res, next) {
  const id = req.params.id;
  const sql = "DELETE FROM books WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return next(err);
    res.redirect('/books/list');
  });
});


//  Export router
module.exports = router;
