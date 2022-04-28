"use strict";

const form = document.getElementById("linkForm");

form.addEventListener("submit", async (event) =>{
    event.preventDefault();
    const link = document.getElementById("link");
    const tableID = link.value;
    const res = await fetch(`/table/${tableID}`, {
        "method": "post"
    });
    if (res.redirected){
        window.location.href = res.url;
    }else{
        // FIXME: dont do this, do something else
        alert("It broke");
    }
});