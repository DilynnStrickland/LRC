"use strict";

function getLink(req, res) {
    const {link} = req.body;
    console.log(link);
    res.redirect(`/table/${link}`);
}

module.exports = {
    getLink,
};