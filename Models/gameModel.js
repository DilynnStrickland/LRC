"use strict";
const db = require("./db");

function getTableID(tableID) {
    const sql = `SELECT tableID From gameTable WHERE tableID=@tableID`;
    const stmt = db.prepare(sql);
    const ID = stmt.get({"tableID": tableID});
    if(!ID) {
        return;
    }
}

module.exports = {
    getTableID
}
