"use strict";
const argon2 = require("argon2");
const userModel = require("../Models/userModel");

async function createNewUser (req,res) {
    const {username,password} = req.body;
    const didCreateUser = await userModel.addUser(username,password);
    if(!didCreateUser) {
        return res.sendStatus(409);
    }
    res.sendStatus(201);
}

async function login (req,res) {
    const {username,password} = req.body;
    const user = userModel.getUserByUsername(username);

    if(!user) {
        return res.sendStatus(400);
    }
    const {hash} = user;

    if(await argon2.verify(hash,password)) {
        req.session.regenerate( (error) => {
            if(error) {
                console.error(error);
                return res.sendStatus(500);
            }

            req.session.user = {
                "username": username,
                "userID": user.userID,
                "isLoggedIn": true
            };
            return res.sendStatus(200);
        });
    } else {
        res.sendStatus(400);
    }
}





module.exports = {
    createNewUser,
    login
}