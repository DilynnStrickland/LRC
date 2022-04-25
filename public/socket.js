"use strict";


const socket = new WebSocket();  // host name goes in the parenthesis

const playBtn = playBtn.getByElementId("playBtn");
const messageBtn = messageBtn.getByElementID("messateBtn");
const messages = document.querySelector('#messages');
const messageBox = document.querySelector('#messageBox');

playBtn.addEventListener("click", (event) =>{
    playBtn.disabled = true;
    socket.send();
});

socket.addEventListener("open", (event) => {
    socket.send(JSON.stringify({
        "cmd": "init-game"
    }));
});


messageBtn.addEventListener("click", (event) =>{
    event.preventDefault();
    if(!ws) {
        showMessage("no websocket connection ");
        return;
    }
    
});

socket.addEventListener("message", (event) =>{
    event.preventDefault();
    const message = parseJSON(message);

    if(message.cmd === "error"){
        
    }else if(message.cmd === "message"){

       ws.send(message.messageSent);
       showMessage(message.messageSent);

    }else if(message.cmd === "whisper"){

        ws.send(message.messageSent);
        showMessage(message.messageSent);

    }else if(message.cmd === "update"){
        
    }

});

function showMessage(message) {
    messages.textContent += `\n\n${message}`;
    messages.scrollTop = messages.scrollHeight;
    messageBox.value = '';
}

function parseJSON(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return {};
    }
}