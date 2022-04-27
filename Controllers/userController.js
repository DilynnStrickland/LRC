"use strict";
const argon2 = require("argon2");
const userModel = require("../Models/userModel");

async function createNewUser (req,res) {
    const {username, password} = req.body;
    const createdUser = await userModel.addUser(username, password);
    if(!createdUser) {
        return res.sendStatus(409);
    }
    res.redirect("/login");
}

async function logIn (req, res) {
    const {username, password} = req.body;
    const user = userModel.getUserByUsername(username);
    if (!user){
        return res.sendStatus(400);
    }
    const {passwordHash} = user;
    if (await argon2.verify(passwordHash, password)) {
        req.session.regenerate( (err) =>{
            if (err){
                console.error(err);
                return res.sendStatus(500);
            }

            req.session.user = {};
            req.session.user.username = username;
            req.session.user.userID = user.userID;
            req.session.user.isLoggedIn = true;

            return res.redirect("/");
        });
    } else {
        return res.sendStatus(400);
    }
}

function updateUsername (req, res){
    userModel.setUsername(req.body.username, req.session.userID);
}






module.exports = {
    createNewUser,
    logIn,
    updateUsername
}