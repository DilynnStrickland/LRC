"use strict";


const socket = new WebSocket("ws://localhost:8080");  // host name goes in the parenthesis


const playBtn = document.getByElementId("playBtn");




// const playBtn = document.getElementbyId("playBtn");
const messageForm = document.getElementById("chatForm");


// playBtn.addEventListener("click", (event) =>{
//     playBtn.disabled = true;
//     socket.send();
// });

socket.addEventListener("open", (event) => {
    socket.send(JSON.stringify({
        "cmd": "join-game"
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
    console.log(event.data);
    const message = parseJSON(event.data);

    if(message.cmd === "error"){
        
    }else if(message.cmd === "post"){
        addPost(message.messageSent);
    }else if(message.cmd === "whisper"){

    }else if(message.cmd === "update"){
        
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