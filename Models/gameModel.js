"use strict";
const db = require("./db");

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
    getTableID,
    getPlayersFromTable
};
