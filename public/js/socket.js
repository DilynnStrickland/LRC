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

});

socket.addEventListener("message", (event) =>{
    const message = parseJSON(event.data);
    console.log(message);

    if(message.cmd === "error"){
        
    }else if(message.cmd === "post"){
        addPost(message.messageSent);
    }else if(message.cmd === "whisper"){

    }else if(message.cmd === "update"){
        updateTable(message.table, message.username);
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

function addPost(data) {
    const newMessage = document.createElement("div");
    newMessage.textContent = data;

    const chatBox = document.getElementById("chatbox");
    chatBox.append(newMessage);
}

function updateTable(table, username){
    const center = table.center;
    const updateCenter = document.getElementById("center");
    updateCenter.textContent = center;

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
}

function createPlayer(player){
    const playerDiv = document.createElement("div");
    const name = document.createElement("h4");
    const money = document.createElement("p");
    
    name.textContent = player.username;
    money.textContent = player.money;
    
    playerDiv.append(name, money);

    return playerDiv;
}