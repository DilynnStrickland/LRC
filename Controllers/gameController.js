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
    return results;
}

module.exports = {
    roll,
}