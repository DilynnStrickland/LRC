"use strict";

const gameModel = require("../Models/gameModel");

function roll(credits) {
    let dice;
    if(credits >= 3) {
        dice = 3;
    }
    else if(credits == 2) {
        dice = 2;
    }
    else if(credits == 1) {
        dice = 1;
    }
    let results = [dice];
   for(let i = 0; i < dice; i++) {
    results[i] = crypto.randomInt(6);
   }
   return results;
}

function play(credits) {
    const results = roll(credits);
    for(let  i = 0; i < results.length(); i++) {
        if(results[i] === 0) {
            // send left
        }
        if(results[i] === 1) {
            //send right
        }
        if(results[i] === 2) {
            // send center
        }

    }
}

function sendLeft() {
    
}
function sendRight() {
    
}

module.exports = {
    roll,
    play,
    sendLeft,
    sendRight

}