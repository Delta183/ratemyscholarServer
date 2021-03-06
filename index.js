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
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
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
        const { name, faculty, rating, school, position, profile_picture } = request.body;
        // TODO: check that each thing here (ex. name, school) are valid before inserting into DB. Check if null, empty, check if number)
        const params = [name, faculty, rating, school, position, profile_picture];
        const insertResult = await db.query("INSERT INTO scholar(name, faculty, rating, school, position, profile_picture) VALUES(?, ?, ?, ?, ?, ?)", params);
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
        const { name, faculty, rating, school, position, profile_picture } = request.body;
        // TODO: check that each thing here (ex. name, school) are valid before inserting into DB. Check if null, empty, check if number)
        // Check that request.params.id is also valid
        const params = [name, faculty, rating, school, position, profile_picture, request.params.id];
        await db.query("UPDATE scholar SET name=?, faculty=?, rating=?, school=?, position=?, profile_picture=? WHERE id=?", params);
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

router.get('/test_rating/:scholar_id', async (request, response) => {
    try {
        const fetchResult = await db.query("SELECT * FROM comments WHERE scholar_id=?", [request.params.scholar_id]);
        const length = fetchResult.length;
        let sum = 0;
        for (var i = 0; i < length; i++) {
            sum += fetchResult[i].rating;
        }
        
        const averageRating = length === 0 ? 0 : sum / length;
        response.json({
            "rating": averageRating.toFixed(1),
        });
    } catch (error) {
        response.status(400).json(error);
    }
});

/// Comments

router.post('/comments', async (request, response) => {
    // TODO: Check request.headers for information on the User
    // and ensure that you only do this for logged in Users
    // request.header("Authorization")
    let didSucceed = false;
    let scholarID = null;
    try {
        const { scholar_id, text, commenter_name, rating} = request.body;
        scholarID = scholar_id;
        // TODO: check that each thing here (ex. name, school) are valid before inserting into DB. Check if null, empty, check if number)
        const params = [scholar_id, text, commenter_name, rating];
        const insertResult = await db.query("INSERT INTO comments(scholar_id, text, commenter_name, rating) VALUES(?, ?, ?, ?)", params);
        const fetchResult = await db.query("SELECT * FROM comments WHERE id=?", [insertResult.insertId]);
        response.json(fetchResult);
        didSucceed = true;
    } catch (error) {
        response.status(400).json(error);
    }

    if (!didSucceed || scholarID === null) {
        return;
    }

    // If we did succeed then we should update the rolling average 
    // FIRST we need to get the sum and count of all ratings for this scholar
    try {
        const fetchResult = await db.query("SELECT * FROM comments WHERE scholar_id=?", [scholarID]);
        const length = fetchResult.length;
        let sum = 0;
        for (var i = 0; i < length; i++) {
            sum += fetchResult[i].rating;
        }
        
        const averageRating = length === 0 ? 0 : sum / length;
        await db.query("UPDATE scholar SET rating=? WHERE id=?", [averageRating, scholarID]);
    } catch (error) {
        console.log("Error computing average: " + error);
    }
});

router.get('/comments/:scholar_id', async (request, response) => {
    try {
        const scholarID = request.params.scholar_id;
        const results = await db.query("SELECT * FROM comments WHERE scholar_id=?", [scholarID]);
        response.json(results);
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