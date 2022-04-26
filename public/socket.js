"use strict";


const socket = new WebSocket("ws://localhost:8080");  // host name goes in the parenthesis

// const playBtn = playBtn.getByElementId("playBtn");
// const messageBtn = messageBtn.getByElementId("messageBtn");

// playBtn.addEventListener("click", (event) =>{
//     playBtn.disabled = true;
//     socket.send();
// });

socket.addEventListener("open", (event) => {
    socket.send(JSON.stringify({
        "cmd": "init-game"
    }));
});


// messageBtn.addEventListener("click", (event) =>{
//     if(!ws) {
//         showMessage("no websocket connection ");
//         return;
//     }
    
// });

socket.addEventListener("message", (event) =>{
    console.log(event.data);
    const message = parseJSON(event.data);

    if(message.cmd === "error"){
        
    }else if(message.cmd === "message"){

       ws.send(message.messageSent);
    }else if(message.cmd === "whisper"){

        ws.send(message.messageSent);

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