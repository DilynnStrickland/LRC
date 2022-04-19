"use strict";
const db = require("./db");
const crypto = require("crypto");
const argon2 = require("argon2");


async function addUser(username, password){
    const userID = crypto.randomUUID();
    const hash = await argon2.hash(password);
    const sql = `INSERT INTO Users (userid, username, hash)
                 VALUES (@userID, @username, @hash)`;
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            "userID": userID,
            "username": username,
            "passwordHash": hash
        });
        return true;
    } catch (e) {
        return false;
    }
}

function getUserByUsername (username){
    const sql = `SELECT * FROM Users WHERE username=@username`;
    const stmt = db.prepare(sql);
    const record = stmt.get({
        "username": username
    });

    return record;
}

module.exports = {
    addUser,
    getUserByUsername
}