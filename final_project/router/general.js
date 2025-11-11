const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (isValid(username)) {
    users.push({ username, password });
    res.status(200).json({ message: `User ${username} registered` });
  } else {
    return res.status(500).json({ message: "Username already registered" });
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  return new Promise((resolve, reject) => {
    res.status(200).json(books);
    resolve();
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error("Book not found"));
    }
  }).then((result) => {
    return res.status(200).json(result);
  }).catch((error) => {
    res.status(404).json({ message: error.message });
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  return new Promise((resolve, reject) => {
    const result = Object.entries(books)
      .filter(([key, value]) => books[key].author === author)
      .map(([key, value]) => value)
    if (result) {
      resolve(result);
    } else {
      reject(new Error(`Book with author ${author} not found`));
    }
  }).then((result) => {
    return res.status(200).json(result);
  }).catch((error) => {
    res.status(404).json({ message: error.message });
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  return new Promise((resolve, reject) => {
    const result = Object.entries(books)
      .filter(([key, value]) => books[key].title === title)
      .map(([key, value]) => value);
    if (result) {
      resolve(result);
    } else {
      reject(new Error(`Book with title ${title} not found`));
    }
  }).then((result) => {
    return res.status(200).json(result);
  }).catch((error) => {
    res.status(404).json({ message: error.message });
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
