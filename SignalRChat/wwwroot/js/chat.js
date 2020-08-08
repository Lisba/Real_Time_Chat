"use strict";

let connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;
let user;
let modal = document.getElementById("modal");

function chooseNickname() {
    document.getElementById("modal").style.display = "none";
    user = document.getElementById("firstName").value;
    document.getElementById('messageInput').style.backgroundColor = '#fff'
}

window.addEventListener('load', () => {
    modal.style.display = "flex";
    document.getElementById('messageInput').style.backgroundColor = '#aaa';
});

function scrollToBottom() {
    let messagesBox = document.getElementById("messagesList");
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

connection.on("ReceiveMessage", function (user, message) {
    let msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let encodedMsg = user + " says: " + msg;
    let li = document.createElement("li");
    li.textContent = encodedMsg;
    document.getElementById("messagesList").appendChild(li);
    scrollToBottom();
});

connection.start()
    .then(function() {
        document.getElementById("sendButton").disabled = false;
    })
    .catch(function(err) {
        return console.error(err.toString());
    });


function send(event) {
    let message = document.getElementById("messageInput").value;

    connection.invoke("SendMessage", user, message)
    .catch(function(err) {
        return console.error(err.toString());
    });

    event.preventDefault();
    document.getElementById("messageInput").value = "";
    scrollToBottom();
}

document.getElementById("sendButton").addEventListener("click", function (event) {
    send(event);
});

window.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        if (modal.style.display === 'flex') {
            chooseNickname()
        }
        else
        {
            send(event);
        }
    }
});
