"use strict";

require("dotenv").config();
const ws = require("ws");


const gameModel = require("./Models/gameModel");

const {app, sessionParser} = require("./app");
const { TABLES, Table, roll, play } = require("./Controllers/gameController");

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});

// live chat stuff is here
const wss = new ws.WebSocketServer({ noServer: true });

server.on("upgrade", handleUpgrade);
wss.on("connection", handleConnection);

function handleUpgrade (req, socket, head){
    sessionParser(req, {}, () => {
        if ( !req.session?.user?.isLoggedIn){
            console.log("looks like someone isn't logged in");
            socket.destroy();
            return;
        }

        wss.handleUpgrade(req, socket, head, function(ws) {
            wss.emit('connection', ws, req);
        });
    });
}

const clients = {};

function handleConnection (ws, request) {

    ws.userID = request.session.user.userID;
    ws.username = request.session.user.username;
    ws.tableID = request.session.user.tableID;

    clients[ws.username] = ws;

    ws.on('message', function(message) {
        message = parseJSON(message);
        console.log(message);
        // send message to everyone-------------------------------------------
        if(message.cmd === "post") {
            const tableID = ws.tableID;
            let table = TABLES[tableID];

            if(!tableID) {
                const errorData  = {
                    "cmd": "error",
                    "errorMessage": "you are not in a game",
                };
                return ws.send(JSON.stringify(errorData));
            }

            const players = table.players;

            for(let i = 0; i < players.length; i++) {
                const playerSocket = clients[players[i].username]; // the current player socket is whatever socket is at element i of players.username
                const sentText = {
                    "cmd": "post",
                    "messageSent": message.messageSent,
                    "username": ws.username
                }
                
                if(playerSocket?.readyState === ws.OPEN) {
                    playerSocket.send(JSON.stringify(sentText));
                }
            }

        } else if(message.cmd === "whisper") {
            const tableID = ws.tableID;
            let table = TABLES[tableID];

            if(!tableID) {
                const errorData = {
                    "cmd": "error",
                    "errorMessage": "you are not in a game",
                };
                return ws.send(JSON.stringify(errorData));
            }

            const players = table.players;

            const privateMessage = {
                "cmd": "whisper",
                "recipient": "@recipient", // FIXME: fix this
                "messageSent": "@message", // FIXME: fix this
            };

            let playerSocket;

            for(let i = 0; i < players.length - 1; i++) {
                playerSocket = clients[players[i].username];
                if(playerSocket === privateMessage.recipient) {
                    i = players.length - 1;
                }
            }
            if(playerSocket?.readyState === ws.OPEN) {
                playerSocket.send(JSON.stringify(privateMessage));
            }
            
            
        } else if (message.cmd === "join-game"){
            const tableID = ws.tableID;
            let table = TABLES[tableID];
            const data = {
                "cmd" : "update",
                "table": table,
            };
            const players = table.players;
            for (const player of players){
                data.username = player.username;
                let playerSocket = clients[player.username];
                if(playerSocket?.readyState === ws.OPEN) {
                    playerSocket.send(JSON.stringify(data));
                }
            }

        }else if (message.cmd === "update"){
            const userID = ws.userID;
            const tableID = ws.tableID;
            let table = TABLES[tableID];
            const players = table.players;
            const playerIndex = players.findIndex((player) =>{
                return player.userID === userID;
            });
            if (playerIndex !== table.currentPlayer){
                return;
            }
            const activePlayer = table.getCurrentPlayer();
            let check;
            if (activePlayer.money !== 0){
                check = play(activePlayer.money, playerIndex, players, table);
            }

            let data = {};
            data.cmd = "update";

            if (check === 1){
                data.cmd = "gameOver";
                data.winner = activePlayer;
            }else{
                table.nextTurn();
                data.rollResult = check;
            }

            data.table = table;
            
            for (const player of players){
                data.username = player.username;
                const playerSocket = clients[player.username];
                if(playerSocket?.readyState === ws.OPEN) {
                    playerSocket.send(JSON.stringify(data));
                }
            }   
        }
    });

    ws.on('close', () => {
        delete clients[ws.username];
    });
}

function parseJSON(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return {};
    }
}

process.once('exit', saveTable);

process.once('SIGUSR2', saveTable);

function saveTable () {
    const saveTables = JSON.stringify(TABLES);
    gameModel.saveGame(saveTables);
    const db = require("./Models/db.js");
    db.close();
};

function restoreTables(){
    const state = gameModel.loadGame();
    console.log(state);
    for (const tableID in state) {
        const table = Table.fromObject(state[tableID]);
        TABLES[tableID] = table;
    }
    console.log(TABLES);
}

restoreTables();