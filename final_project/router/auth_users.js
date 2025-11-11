const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return !users.some((user) => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 * 1000 });
    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.user;
  const { review } = req.body;
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    book.reviews[user.data] = review;
    return res.status(200).json({ message: "Successfully added a review" });
  } else {
    return res.status(400).json({ message: "Book does not exists" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const user = req.user;
  const { isbn } = req.params;
  const book = books[isbn];

  if (book) {
    delete book.reviews[user.username];
    return res.status(200).json({ message: "Successfully delete a review" });
  } else {
    return res.status(400).json({ message: "Book does not exists" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
