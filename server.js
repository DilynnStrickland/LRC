"use strict";

require("dotenv").config();
const ws = require("ws");

const gameModel = require("./Models/gameModel");

const {app, sessionParser} = require("./app");

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
});

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
        if(message.cmd === "message") {
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
                const playerSocket = clients[players[i].username]; // 
                const sentText = {
                    "cmd": "message",
                    "messageSent": message,
                }
                if(playerSocket.readyState === ws.OPEN) {
                    playerSocket.send(JSON.stringify(sentText));
                }
            }
        } else if(message.cmd === "privateMessage") {
            const tableID = gameModel.getTableID(ws.userID);
            if(!tableID) {
                const errorData = {
                    "cmd": "error",
                    "errorMessage": "you are not in a game",
                };
                return ws.send(Json.stringify(errorData));
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