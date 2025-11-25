const express = require("express")
const router = express.Router()

const db = global.db

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('./users/login')
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
  const sql = "SELECT * FROM books WHERE title LIKE ? OR author LIKE ?"
  db.query(sql, [`%${term}%`, `%${term}%`], (err, result) => {
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
  const title = req.sanitize(req.body.title)
  const author = req.sanitize(req.body.author)
  const year = req.body.year   // number doest get sanitised

  const sql = "INSERT INTO books (title, author, year) VALUES (?, ?, ?)"
  db.query(sql, [title, author, year], (err) => {
      if (err) return next(err)
      res.redirect("./books/list")
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
  const title = req.sanitize(req.body.title)
  const author = req.sanitize(req.body.author)
  const year = req.body.year

  const sql = "UPDATE books SET title = ?, author = ?, year = ? WHERE id = ?"
  db.query(sql, [title, author, year, id], (err) => {
    if (err) return next(err)
    res.redirect('./books/list')
  })
})


// delete book
router.get('/delete/:id', redirectLogin, (req, res, next) => {
  const id = req.params.id
  const sql = "DELETE FROM books WHERE id = ?"
  db.query(sql, [id], (err) => {
    if (err) return next(err)
    res.redirect('./books/list')
  })
})

module.exports = router
