"use strict";

let connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;
let user;
let modal = document.getElementById("modal");

function chooseNickname() {
    document.getElementById("modal").style.display = "none";
    user = document.getElementById("firstName").value;
}

window.addEventListener('load', () => {
    modal.style.display = "flex";
});

function scrollToBottom() {
    let messagesBox = document.getElementById("messagesList");
    messagesBox.scrollTop = messagesBox.scrollHeight;
}

function currentTime() {
    let time = new Date();
    let messageHour = document.createElement('span');

    messageHour.innerHTML = `${time.getHours()}:${time.getMinutes()}`;

    return messageHour;
}

function createElements() {
    let li = document.createElement("li");
    let div = document.createElement('div');
    let h3 = document.createElement("h6");
    let p = document.createElement("p");
    let hour = currentTime();

    li.appendChild(hour);

    return [li, div, h3, p];
}

connection.on("ReceiveMessage", function (user, message) {
    let msg = message //.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let nodes = createElements();

    nodes[2].textContent = user;
    nodes[3].textContent = msg;

    nodes[1].appendChild(nodes[2]);
    nodes[1].appendChild(nodes[3]);
    nodes[0].appendChild(nodes[1]);

    document.getElementById("messagesList").appendChild(nodes[0]);
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
