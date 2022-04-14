"use strict";

require("dotenv").config();
const ws = require("ws");

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
    const userId = request.session.user.userID;

    ws.userID = req.session.user.userID;
    ws.username = req.session.user.username;

    clients[ws.username] = ws;


    ws.on('close', () => {
        delete clients[ws.username];
    });
}