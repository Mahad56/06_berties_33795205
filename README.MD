# Bertie’s Books – Lab 8: Sessions and Access Control

This lab adds user session management and access control to the Bertie’s Books application using the express-session module.

---

##  Session Setup

Sessions were configured in `index.js` using the `express-session` package:

```js
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }
}));
The secret signs session IDs to prevent tampering.
A logged-in user keeps their session until the cookie expires or they log out.

 Login Session
When a login is successful, the session is saved:

js
Copy code
req.session.userId = req.body.username;
This identifies the current logged-in user for future requests.

 Access Control (redirectLogin Middleware)
The following middleware was added in users.js:

js
Copy code
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/users/login');
    } else {
        next();
    }
};
This ensures only authenticated users can access protected routes.

 Protected Routes
These routes require login and use redirectLogin:

/users/list

/books/list

/books/add

/books/edit/:id

/books/delete/:id

If the user is not logged in, they are redirected to the login page.

Public Routes
These routes are always accessible:

/

/about

/users/login

/users/register

/books/search

/books/search-results

Logout Functionality
A logout route was added in main.js:

js
Copy code
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('./');
        res.send('You are now logged out. <a href="./">Home</a>');
    });
});
A logout link was added to the navigation so users can end their session.

Testing
When NOT logged in:
Visiting any protected route redirects to /users/login.

When logged in:
All protected pages load normally.
Session cookie appears in browser storage.

After logout:
Session is destroyed.
Protected pages redirect to login again.

Part C – Sanitisation & XSS Protection
XSS Demonstration

Before sanitisation, the following input:

Henry <script>alert("Gotcha!")</script>


Triggered a JavaScript popup because raw HTML was being printed back to the browser in the registration confirmation page.

This proves the site was vulnerable to XSS.

 Sanitisation Added

Added in index.js:

const expressSanitizer = require("express-sanitizer");
app.use(expressSanitizer());


Applied sanitisation in users.js:

const first = req.sanitize(req.body.first);
const last = req.sanitize(req.body.last);
const email = req.sanitize(req.body.email);
const username = req.sanitize(req.body.username);
const plainPassword = req.sanitize(req.body.password);

Applied sanitisation in books.js:

title
author
keyword
Not sanitised:

year because it is numeric.

After Sanitisation
Entering XSS payload no longer executes:
<script> tags are removed.
The popup does not appear.

The saved value becomes:
Henry alert("Gotcha!")

Part D – Goldsmiths Compliance
1. Test User (Required for Marking)

Added to SQL:

username: gold
password: smiths
Hash used (as required):

$2b$10$WiTx/9NmkS8iy3E33xFu4O2UKthnJFhlUWpxcYhZmuvn0c6bVyYl.

This user logs in correctly.

2. Environment Variables (.env)

The application uses:

DB_HOST=localhost
DB_USER=berties_books_app
DB_PASS=qwertyuiop
DB_NAME=berties_books
PORT=8000

Matches the values required in the lab instructions

 How to run :
The project was pushed to GitHub and redeployed on the Goldsmiths VM:


Copy code
git pull
npm install
node index.js
