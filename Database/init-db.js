"use strict";
require('dotenv').config();
const fs = require("fs");
const db = require("../Models/db");

const schemaString = fs.readFileSync(__dirname + "/schema.sql", "utf-8");

db.exec(schemaString);