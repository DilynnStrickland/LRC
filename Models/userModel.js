"use strict";
const db = require("./db");
const crypto = require("crypto");
const argon2 = require("argon2");


async function addUser(username, password){
    const userID = crypto.randomUUID();
    const hash = await argon2.hash(password);
    const sql = `INSERT INTO Users (userID, username, passwordHash) 
    VALUES(@userID, @username, @hash)`;
    const stmt = db.prepare(sql);
    try {
        stmt.run({
            "userID":userID,
            "username":username,
            "hash":hash,
        });
        return true;
    } catch (err) {
        console.error(err);
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

function getUserByUserID (userID) {
    const sql = `SELECT * FROM Users WHERE userID=@userID`;
    const stmt = db.prepare(sql);
    const user = stmt.get({
        "userID": userID
    });

    return user;
}

function setUsername (username, userID) {
    const sql = `UPDATE Users SET username=@username WHERE userID=@userID`;
    const stmt = db.prepare(sql);
    stmt.run({"username": username, "userID": userID});
}

module.exports = {
    addUser,
    getUserByUsername,
    getUserByUserID,
    setUsername
}