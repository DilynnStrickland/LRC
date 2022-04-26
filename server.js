"use strict";

require("dotenv").config();
const ws = require("ws");

const gameModel = require("./Models/gameModel");

const {app, sessionParser} = require("./app");

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});

// live chat stuff is here
const wss = new ws.WebSocketServer({ noServer: true });

server.on("upgrade", handleUpgrade);
wss.on("connection", handleConnection);

function handleUpgrade (req, socket, head){
    sessionParser(req, {}, () => {
        if (!req.session.isLoggedIn){
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

    clients[ws.username] = ws;

    ws.on('message', function(message) {
        message = parseJSON(message);
        console.log(message);
        // send message to everyone-------------------------------------------
        if(message.cmd === "post") {
            const tableID = gameModel.getTableID(ws.userID);
            if(!tableID) {
                const errorData  = {
                    "cmd": "error",
                    "errorMessage": "you are not in a game",
                };
                return ws.send(JSON.stringify(errorData));
            }
            const players = gameModel.getPlayersFromTable(tableID);
            for(let i = 0; i < players.length; i++) {
                const playerSocket = clients[players[i].username]; // the current player socket is whatever socket is at element i of players.username
                const sentText = {
                    "cmd": "post",
                    "messageSent": "@message", // still doesn't work, message is an object not a string
                }
                
                if(playerSocket.readyState === ws.OPEN) {
                    playerSocket.send(JSON.stringify(sentText));
                }
            }
            // send message to everyone ---------------------------------------

        } else if(message.cmd === "whisper") {
            const tableID = gameModel.getTableID(ws.userID);
            if(!tableID) {
                const errorData = {
                    "cmd": "error",
                    "errorMessage": "you are not in a game",
                };
                return ws.send(JSON.stringify(errorData));
            }
            const players = gameModel.getPlayersFromTable(tableID);
            const privateMessage = {
                "cmd": "whisper",
                "recipient": "@recipient",
                "messageSent": "@message",
            };
            let playerSocket;
            for(let i = 0; i < players.length; i++) {
                playerSocket = clients[players[i].username];
                if(playerSocket === privateMessage.recipient) {
                    i = players.length;
                }
            }
            playerSocket.send(JSON.stringify(privateMessage));
            
        } else if (message.cmd === "init-game"){
            // get game state

            // send back the game state
            ws.send();
        }else if (message.cmd === "update"){


            ws.send();
        }
        // send message to private: --------------------------------------------
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

module.exports = {
    handleUpgrade,
    handleConnection
}
