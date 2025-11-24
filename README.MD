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

 How to run :
The project was pushed to GitHub and redeployed on the Goldsmiths VM:


Copy code
git pull
npm install
node index.js
