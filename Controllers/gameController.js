"use strict";
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
    static fromObject(tableState){
        const table = new Table();
        table.tableID = tableState.tableID;
        table.players = tableState.players.map(player => Player.fromObject(player));
        table.center = tableState.center;
        table.currentPlayer = tableState.currentPlayer;

        return table;
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
    toJSON(){
        const table = {
            "tableID" : this.tableID,
            "players" : this.players,
            "center" : this.center,
            "currentPlayer" : this.currentPlayer,
            "numPlayers" : this.numPlayers
        };
        
        return table;
    }
};

class Player {
    constructor(username, userID, tableID){
        this.username = username;
        this.userID = userID;
        this.money = 3;
        this.tableID = tableID;
    }

    static fromObject(playerState){
        const player = new Player();
        player.username = playerState.username;
        player.userID = playerState.userID;
        player.money = playerState.money;
        player.tableID = playerState.tableID;

        return player;
    }

    toJSON(){
        const player = {
            "username" : this.username,
            "userID" : this.userID,
            "money" : this.money,
            "tableID" : this.tableID,
        };

        return player;
    }
};

function createNewTable(req, res){
    const tableID = gameModel.createTable(req.session.user.userID);
    req.session.user.tableID = tableID;
    req.session.user.playerNumber = 0;
    const player = new Player(req.session.user.username, req.session.user.userID, tableID);
    const table = new Table(player, tableID);

    TABLES[tableID] = table;

    res.redirect(`/table/${tableID}`);
}

function getTable(req, res){
    if (!req.session?.user?.tableID){
        return res.redirect("/");
    } else if(req.session.user.tableID !== req.params.tableID){
        return res.redirect(`/table/${req.session.user.tableID}`);
    }
    const table = TABLES[req.session.user.tableID];
    const player = table.players[req.session.user.playerNumber];


    res.render("table", {"player": player, "center": "table.center"});
}

function addPlayer(req, res){
    if (!req.session?.user?.userID){
        return res.redirect("/");
    }
    const tableID = req.params.tableID;
    if (req.session.user.tableID){
        return res.redirect(`/table/${req.session.user.tableID}`);
    }
    req.session.user.tableID = tableID;
    console.log(tableID);
    const table = TABLES[tableID];
    console.log(table);
    const player = new Player(req.session.user.username, req.session.user.userID, tableID);
    req.session.user.playerNumber = table.players.length;
    TABLES[tableID].addPlayer(player);
    gameModel.addToTable(req.session.user.userID, tableID);

    res.redirect(`/table/${tableID}`);
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
    addPlayer,
    getTable,
    Table
};