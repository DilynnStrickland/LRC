"use strict";
const argon2 = require("argon2");
const { func } = require("joi");
const userModel = require("../Models/userModel");

async function createNewUser (req,res) {
    const {username, password} = req.body;
    const user = await userModel.addUser(username, password);
    if (!user){
        return res.sendStatus(409);
    }else{
        return res.sendStatus(201);
    }
}

async function logIn (req, res) {
    const {username, password} = req.body;
    const user = userModel.getUserByUsername(username);
    if (!user){
        return res.sendStatus(400);
    }
    const {hash} = user;
    const verify = await argon2.verify(hash, password);
    if (verify){
        req.session.regenerate((err) =>{
            if (err){
                console.error(err);
                return res.sendStatus(500);
            }

            req.session.user = {};
            req.session.user.username = username;
            req.session.user.userID = user.userID;
            req.session.user.isLoggedIn = true;

            return res.sendStatus(200);
        });
    } else{
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