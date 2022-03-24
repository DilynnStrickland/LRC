"use strict";
const db = require("./db");
const crypto = require("crypto");
const argon2 = require("argon2");


async function addUser(username,password) {
    const uuid = crypto.randomUUID();
    const sql = `INSERT INTO Users (userID, username, hash)
    VALUES (@userID, @username, @hash)`;
    const stmt = db.prepare(sql);
    try {
        const hash = await argon2.hash(password);
        stmt.run({
            "userID":uuid,
            "username":username,
            "hash":hash,
        });
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

function getUserByUsername(username) {
    const sql = `SELECT * FROM Users WHERE username = @username`;
    const stmt = db.prepare(sql);
    const record = stmt.get({
        "username":username
    });
    return record;
}

module.exports = {
    addUser,
    getUserByUsername
}