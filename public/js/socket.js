"use strict";

const socket = new WebSocket(`ws://${window.location.host}`);  // host name goes in the parenthesis

const rollBtn = document.getElementById("roll");
const messageForm = document.getElementById("chatForm");

socket.addEventListener("open", (event) => {
    socket.send(JSON.stringify({
        "cmd": "join-game"
    }));
});

rollBtn.addEventListener("click", (event) =>{
    rollBtn.disabled = true;
    socket.send(JSON.stringify({
        "cmd": "update"
    }));
});

messageForm.addEventListener("submit", (event) =>{
    event.preventDefault();
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    console.log(message);
    const data = {
        "cmd": "post",
        "messageSent": message
    };
    socket.send(JSON.stringify(data));
    messageInput.value = "";
});

socket.addEventListener("message", (event) =>{
    const message = parseJSON(event.data);
    console.log(message);

    if(message.cmd === "error"){
        
    }else if(message.cmd === "post"){
        addPost(message.username, message.messageSent);
    }else if(message.cmd === "whisper"){

    }else if(message.cmd === "update"){
        updateTable(message.table, message.username, message.rollResult);
    }else if (message.cmd === "gameOver"){
        gameOver(message.winner);
    }

});

function parseJSON(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return {};
    }
}

function addPost(username, data) {
    const newMessage = document.createElement("div");
    newMessage.textContent = username + ": " + data;

    const chatBox = document.getElementById("chatbox");
    chatBox.append(newMessage);
}

function updateTable(table, username, rollResult){
    const center = table.center;
    const updateCenter = document.getElementById("center");
    updateCenter.textContent = center;

    const rollResultDiv = document.getElementById("rollResult");
    rollResultDiv.textContent = "Roll Result: " + rollResult;

    const playersContainer = document.getElementById("players");
    playersContainer.innerHTML = "";
    const players = table.players;
    for (const player of players){
        const playerDiv = createPlayer(player);
        playersContainer.append(playerDiv);
    }
    
    if (table.players[table.currentPlayer].username === username){
        rollBtn.classList.remove("invisible");
        rollBtn.disabled = false;
    }else{
        rollBtn.classList.add("invisible");
        rollBtn.disabled = true;
    }
    const tableID = document.getElementById("tableID");
    tableID.textContent = table.tableID;
}

function createPlayer(player){
    const playerDiv = document.createElement("div");
    const name = document.createElement("h4");
    const money = document.createElement("p");
    playerDiv.classList.add("bg-purple-500");
    playerDiv.classList.add("text-white");
    playerDiv.classList.add("text-xl");
    playerDiv.classList.add("font-bold");
    playerDiv.classList.add("py-2");
    playerDiv.classList.add("rounded");
    playerDiv.classList.add("shadow-lg");
    playerDiv.classList.add("mx-2.5");
    playerDiv.classList.add("margin");
    
    name.textContent = player.username;
    money.textContent = "Money: $" + player.money;
    
    playerDiv.append(name, money);

    return playerDiv;
}

function gameOver(winner){
    rollBtn.classList.add("invisible");
    rollBtn.disabled = true;
    const winnerID = document.getElementById("winner");
    winnerID.textContent = "Winner: " + winner.username;
}