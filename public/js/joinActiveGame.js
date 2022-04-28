"use strict";

const form = document.getElementById("linkForm");
form.addEventListener("submit", (event) =>{
    event.preventDefault();
    const link = document.getElementById("link");
    const tableID = link.value;
    window.location.href = `${window.location.origin}/table/${tableID}`;
});