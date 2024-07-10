const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users[username]) {
        return res.status(400).json({ message: "Username already exists" });
    }
    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop using Async-Await
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/books'); // Assume your book data is available at this endpoint
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get book details based on ISBN using Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`http://localhost:5000/books/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get('http://localhost:5000/books');
        const booksByAuthor = Object.values(response.data).filter(book => book.author === author);
        if (booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor);
        } else {
            return res.status(404).json({ message: "Books by this author not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get all books based on title using Async-Await
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const response = await axios.get('http://localhost:5000/books');
        const booksByTitle = Object.values(response.data).filter(book => book.title === title);
        if (booksByTitle.length > 0) {
            return res.status(200).json(booksByTitle);
        } else {
            return res.status(404).json({ message: "Books with this title not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Reviews for this book not found" });
    }
});

module.exports.general = public_users;
