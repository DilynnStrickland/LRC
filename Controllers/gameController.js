"use strict";
const { table } = require("console");
const crypto = require("crypto");
const session = require("express-session");
const gameModel = require("../Models/gameModel");

const TABLES = {};

class Table {
    constructor(player, tableID){
        this.tableID = tableID;
        this.players = [];
        this.players.push(player);
        this.center = 0;
        this.currentPlayer = 0;
    }
    getCurrentPlayer(){
        return this.players[this.currentPlayer];
    }
    addPlayer(player){
        this.players.push(player);
    }
    nextTurn(){
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        return this.players[this.currentPlayer];
    }
};

class Player {
    constructor(username, userID, tableID){
        this.username = username;
        this.userID = userID;
        this.money = 3;
        this.tableID = tableID;
    }
};

function createNewTable(req, res){
    const tableID = gameModel.createTable(req.session.user.userID);
    req.session.user.tableID = tableID;
    const player = new Player(req.session.user.username, req.session.user.userID, tableID);
    const table = new Table(player, tableID);

    TABLES[tableID] = table;

    res.render("table", {"player": player, "center": table.center});
}

function addPlayer(req, res){
    const tableID = req.params.tableID;
    const player = new Player(req.session.user.username, req.session.user.userID, tableID);
    TABLES[tableID].addPlayer(player);
}

function roll(credits) {
    let dice;
    if(credits >= 3) {
        dice = 3;
    }
    else if(credits == 2) {
        dice = 2;
    }
    else if(credits == 1) {
        dice = 1;
    }
    let results = [dice];
   for(let i = 0; i < dice; i++) {
    results[i] = crypto.randomInt(6);
   }
   return results;  // returns the array of values that were rolled
}


function play(credits, index, players) { // players is an array
    const results = roll(credits);
    for(let  i = 0; i < results.length(); i++) {
        if(results[i] === 0) {
            sendLeft(index, players);
        }
        if(results[i] === 1) {
            sendRight(index, players);
        }
        if(results[i] === 2) {
            players[index] -= 1;
            table.center += 1;
        }

    }
}

function getLeft(index, players){  // players is an array
    let left;
    if (index === 0){
        left = players[players.size - 1];
    }else{
        left = players[index - 1];
    }
    return left;
}

function getRight(index, players){  // players is an array
    let right;
    if(index === 0){
        right = players[0];
    }else{
        right = players[index + 1];
    }
    return right;
}

function sendLeft(index, players) {  // players is an array
    const leftPlayer = getLeft(index, players);
    players[index].credits -= 1;
    leftPlayer.credits += 1;
}

function sendRight(index, players) {  // players is an array
    const rightPlayer = getRight(index, players);
    players[index].credits -= 1;
    rightPlayer.credits += 1;
}

module.exports = {
    createNewTable,
    roll,
    play,
    sendLeft,
    sendRight,
    TABLES,
    addPlayer
}