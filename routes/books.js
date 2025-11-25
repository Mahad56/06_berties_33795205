const express = require("express")
const router = express.Router()

const db = global.db

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('../users/login')
    }
    next()
}

// list all books
router.get('/list', redirectLogin, function (req, res, next) {
  const sqlquery = "SELECT * FROM books"
  db.query(sqlquery, (err, result) => {
    if (err) return next(err)
    res.render("books/list", { books: result })
  })
})

// search form
router.get('/search', function (req, res) {
  res.render("books/search")
})

// search results
router.get('/search-results', function (req, res, next) {
  const term = req.sanitize(req.query.keyword || "")
  const sql = "SELECT * FROM books WHERE name LIKE ?"
  db.query(sql, [`%${term}%`], (err, result) => {
    if (err) return next(err)
    res.render("books/search_results", { books: result, term })
  })
})

// add form
router.get('/add', redirectLogin, (req, res) => {
  res.render('books/add')
})

// add submit
router.post('/add', redirectLogin, (req, res, next) => {
  const name = req.sanitize(req.body.name)
  const price = req.body.price

  const sql = "INSERT INTO books (name, price) VALUES (?, ?)"
  db.query(sql, [name, price], (err) => {
      if (err) return next(err)
      res.redirect("../books/list")
  })
})

// edit form
router.get('/edit/:id', redirectLogin, (req, res, next) => {
  const id = req.params.id
  const sql = "SELECT * FROM books WHERE id = ?"
  db.query(sql, [id], (err, result) => {
    if (err) return next(err)
    res.render("books/edit", { book: result[0] })
  })
})

// edit submit
router.post('/edit/:id', redirectLogin, (req, res, next) => {
  const id = req.params.id
  const name = req.sanitize(req.body.name)
  const price = req.body.price

  const sql = "UPDATE books SET name = ?, price = ? WHERE id = ?"
  db.query(sql, [name, price, id], (err) => {
    if (err) return next(err)
    res.redirect('../books/list')
  })
})

// delete book
router.get('/delete/:id', redirectLogin, (req, res, next) => {
  const id = req.params.id
  const sql = "DELETE FROM books WHERE id = ?"
  db.query(sql, [id], (err) => {
    if (err) return next(err)
    res.redirect('../books/list')
  })
})

module.exports = router
