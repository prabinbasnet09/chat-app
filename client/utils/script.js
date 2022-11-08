// const users = require('./users')

const socket = io()

const messageBox = document.querySelector('.chatAppMessage')
const inputBox = document.querySelector('.inputBox')

document.querySelector('.clearChatBox').addEventListener('click', (event)=> {
    event.preventDefault();
    messageBox.innerHTML = ""
})

document.querySelector(".chatroomSend").addEventListener('click', (event)=> {
    event.preventDefault();
    const message = inputBox.value;

    displayMessage(message)      //displays message on the sender side
    
    socket.emit("send-message", message)
})

function joinRoom(roomName){
    socket.emit("joinRoom", roomName, (args) => {
        displayMessage(args)
    })
}

function displayMessage(text){
    const message = document.createElement('p');
    message.textContent = text;

    messageBox.appendChild(message);
    document.querySelector('.inputBox').value = ""
}

socket.on("new-user", (username, room, cb) => {
    displayMessage(`Welcome ${username} to ${room}`)
    cb()
})

socket.on("receive-message", (message => {
    displayMessage(message)
}))

socket.on("disconnect", () => {
    console.log("Disconnected")
})
