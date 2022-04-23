"use strict";


const socket = new WebSocket();  // host name goes in the parenthesis

const playBtn = playBtn.getByElementId("playBtn");

playBtn.addEventListener("click", (event) =>{
    playBtn.disabled = true;
    socket.send();
});

socket.addEventListener("open", (event) => {
    socket.send(JSON.stringify({
        "cmd": "init-game"
    }));
});

socket.addEventListener("message", (event) =>{
    const message = parseJSON(message);

    if(message.cmd === "error"){

    }else if(message.cmd === "message"){

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