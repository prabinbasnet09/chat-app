// const users = require('./users')

const socket = io()
const messageBox = document.querySelector('.chatAppMessage')
const inputBox = document.querySelector('.inputBox')
const clubBox = document.querySelector('.club')

document.querySelector(".chatroomSend").addEventListener('click', (event)=> {
    event.preventDefault();
    const message = inputBox.value;
    const roomName = clubBox.value;

    displayMessage(message)      //displays message on the sender side
    
    socket.emit("send-message", message, roomName)
})

clubBox.addEventListener('click', (event) => {
    event.preventDefault()
    let roomName = event.target.value;
    if(roomName === "") return 
    joinRoom(roomName)
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

socket.on("new-user", (user) => {
    displayMessage(`Welcome ${user.username} to ${user.room}`)
    console.log(user)
})

socket.on("receive-message", (message => {
    displayMessage(message)
}))

socket.on("disconnect", () => {
    console.log("Disconnected")
})

