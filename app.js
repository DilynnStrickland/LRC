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
        maxAage: 1000 * 60 * 600, // big number for testing cookies
    }
};

// enable session management
const sessionParser = session(sessionConfig);
app.use(sessionParser);

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
const gameController = require("./Controllers/gameController");
const userController = require("./Controllers/userController");

app.set("view engine", "ejs");

/********************************************************
 * ENDPOINTS
 ********************************************************/
 app.post("/api/user", 
 userValidator.validateRegisterBody, 
 userController.createNewUser,
);

app.post("/api/login",
 userValidator.validateRegisterBody,
 userController.logIn
 );

 app.get("/", (req, res) => {
    res.render("index", {"loggedIn": req.session?.user?.isLoggedIn});
 });



app.post("/api/chat");


app.get("/table/:tableID", gameController.createNewTable);
app.post("/table/:tableID", gameController.addPlayer);

module.exports = {
    app,
    sessionParser
};