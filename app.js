"use strict";
require("dotenv").config();
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect=redis")(session);
const express = require("express");
const app = express();


/********************************************************
 * REQUIRE VALIDATORS
 ********************************************************/


/********************************************************
 * REQUIRE CONTROLLERS
 ********************************************************/




/********************************************************
 * ENDPOINTS
 ********************************************************/


module.exports = app;