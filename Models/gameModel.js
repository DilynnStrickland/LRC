"use strict";
const db = require("./db");
const crypto = require("crypto");
const argon2 = require("argon2");

const userModel = require("./userModel");

function createTable(userID) {
    const tableID = crypto.randomUUID();
    const sql = `INSERT INTO GameTable (tableID, userID)
                 VALUES (@tableID, @userID)`;
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            "tableID": tableID,
            "userID": userID
        });
        return tableID;
    } catch (e) {
        return false;
    }
}

function addToTable(userID, tableID) {
    const sql = `INSERT INTO GameTable (tableID, userID)
                 VALUES (@tableID, @userID)`;
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            "tableID": tableID,
            "userID": userID
        });
        return tableID;
    } catch (e) {
        return false;
    }
}

function getTableID(userID) {
    const sql = `SELECT tableID From GameTable WHERE userID=@userID`;
    const stmt = db.prepare(sql);
    return stmt.get({"userID": userID});
}

function getPlayersFromTable(tableID) {
    const sql = `SELECT username, GameTable.userID as userID FROM GameTable JOIN Users ON GameTable.userID=Users.userID WHERE tableID=@tableID`;
    const stmt = db.prepare(sql);
    return stmt.all({"tableID":tableID});
}

// implement valid table id?

module.exports = {
    createTable,
    addToTable,
    getTableID,
    getPlayersFromTable
};
