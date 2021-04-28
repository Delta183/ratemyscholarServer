"use strict";

// Constants
const PORT = process.env.PORT || 8080;

// Imports
const express = require('express');
const Router = require("express-promise-router");
const db = require("./db");

// App Setup
const app = express();
const router = new Router();
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
    console.log(`Express server running on port: ${PORT}`);
});

// Routes

/// Scholars

router.get('/scholars', async (request, response) => {
    try {
        const results = await db.query("SELECT * FROM scholar");
        response.json(results);
    } catch (error) {
        response.status(400).json(error);
    }
});

router.post('/scholars', async (request, response) => {
    // TODO: Check request.headers for information on the User
    // and ensure that you only do this for logged in Users
    // request.header("Authorization")
    try {
        const { name, faculty, comments, rating, school, position, profile_picture } = request.body;
        // TODO: check that each thing here (ex. name, school) are valid before inserting into DB. Check if null, empty, check if number)
        const params = [name, faculty, comments, rating, school, position, profile_picture];
        const insertResult = await db.query("INSERT INTO scholar(name, faculty, comments, rating, school, position, profile_picture) VALUES(?, ?, ?, ?, ?, ?, ?)", params);
        const fetchResult = await db.query("SELECT * FROM scholar WHERE id=?", [insertResult.insertId]);
        response.json(fetchResult);
    } catch (error) {
        response.status(400).json(error);
    }
});

router.put('/scholars/:id', async (request, response) => {
    // TODO: Check request.headers for information on the User
    // and ensure that you only do this for logged in Users
    // request.header("Authorization")
    try {
        const { name, faculty, comments, rating, school, position, profile_picture } = request.body;
        // TODO: check that each thing here (ex. name, school) are valid before inserting into DB. Check if null, empty, check if number)
        // Check that request.params.id is also valid
        const params = [name, faculty, comments, rating, school, position, profile_picture, request.params.id];
        await db.query("UPDATE scholar SET name=?, faculty=?, comments=?, rating=?, school=?, position=?, profile_picture=? WHERE id=?", params);
        const fetchResult = await db.query("SELECT * FROM scholar WHERE id=?", [request.params.id]);
        response.json(fetchResult);
    } catch (error) {
        response.status(400).json(error);
    }
});

router.delete('/scholars/:id', async (request, response) => {
    // TODO: Check request.headers for information on the User
    // and ensure that you only do this for logged in Users
    // request.header("Authorization")
    try {
        // Check that request.params.id is also valid
        // console.log(request.params.id);
        // console.log("Deletion complete.");
        await db.query("DELETE FROM scholar WHERE id=?", [request.params.id]);
        response.status(200).json();
    } catch (error) {
        response.status(400).json(error);
    }
});

router.get('/scholars/:id', async (request, response) => {
    // TODO: Check request.headers for information on the User
    // and ensure that you only do this for logged in Users
    // request.header("Authorization")
    try {
        // Check that request.params.id is also valid
        const fetchResults = await db.query("SELECT * FROM scholar WHERE id=?", [request.params.id]);
        response.json(fetchResults[0]); // SELECT always returns an array
    } catch (error) {
        response.status(400).json(error);
    }
});

/// Search

router.get('/scholar_search/:query', async (request, response) => {
    // TODO: Check request.headers for information on the User
    // and ensure that you only do this for logged in Users
    // request.header("Authorization")
    try {
        // Check that request.params.id is also valid
        const fetchResults = await db.query("SELECT * FROM scholar WHERE name LIKE CONCAT('%', ?, '%')", [request.params.query]);
        response.json(fetchResults);
    } catch (error) {
        response.status(400).json(error);
    }
});

/// Accounts

router.get('/accounts', async (request, response) => {
    try {
        const results = await db.query("SELECT * FROM accounts");
        response.json(results);
    } catch (error) {
        response.status(400).json(error);
    }
});