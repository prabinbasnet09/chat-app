// import {io} from 'socket.io-client'

const socket = io('http://localhost:3000')
const messageBox = document.querySelector('.chatAppMessage')
const inputBox = document.querySelector('.inputBox')
const clubBox = document.querySelector('.club')

document.querySelector(".chatroomSend").addEventListener('click', sendMessage)
clubBox.addEventListener('click', () => {
    const clubName = clubBox.addEventListener('select', (event)=> {
        console.log(event.value)
    })
})

function sendMessage(event){
    event.preventDefault();
    const message = inputBox.value;

    displayMessage(message)      //displays message on the sender side
   
    socket.emit("send-message", message)
}

function joinRoom(event){
    club
    event.preventDefault();
    
}

function displayMessage(text){
    const message = document.createElement('p');
    message.textContent = text;

    messageBox.appendChild(message);
    document.querySelector('.inputBox').value = ""
}

socket.on('connect', () => {
    displayMessage(`Your socket id is ${socket.id}`)
})

socket.on("receive-message", message => {
    displayMessage(message)
})

socket.on("disconnect", () => {
    console.log("Disconnected")
})

