"use strict";
require("dotenv").config();
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const express = require("express");
const app = express();

const sessionConfig = {
    store: new RedisStore({ client: redis.createClient()}),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false, 
    name: "session",
    cookie: {
        httpOnly: true,
        maxAage: 1000 * 60 * 8,
    }
};

// enable session management
app.use(session(sessionConfig));

// Allow access to static resources in the public directory
app.use(express.static("public", {index: "index.html", extensions: ["html"]}));

// The maximum request body size is 100 kilobytes; however, my word list was
// ~150kb. So I just doubled the request body size limit
app.use(express.json({limit: '200kb'}));
app.use(express.urlencoded({ extended: false }));


/********************************************************
 * REQUIRE VALIDATORS
 ********************************************************/
const userValidator = require("./Validators/userValidator");

/********************************************************
 * REQUIRE CONTROLLERS
 ********************************************************/
//const gameController = require("./Controllers/gameController");
const userController = require("./Controllers/userController");



/********************************************************
 * ENDPOINTS
 ********************************************************/
 app.post("/api/user", 
 userValidator.validateRegisterBody, 
 userController.createNewUser
);

app.post("/api/login",
 userValidator.validateRegisterBody,
 userController.logIn
);

module.exports = app;