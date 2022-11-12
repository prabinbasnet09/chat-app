// const users = require('./users')

const socket = io()

const messageBox = document.querySelector('.chatAppMessage')
const inputBox = document.querySelector('.inputBox')

document.querySelector('.clearChatBox').addEventListener('click', (event)=> {
    event.preventDefault();
    messageBox.innerHTML = ""
})

document.querySelector(".chatRoomSend").addEventListener('click', (event)=> {
    event.preventDefault();
    const message = inputBox.value;

    displayMessage(message)      //displays message on the sender side
    
    socket.emit("send-message", message)
})

function displayMessage(text){
    const message = document.createElement('p');
    message.textContent = text;

    messageBox.appendChild(message);
    inputBox.value = ""
}

function displayChatBoxName(room){
    const heading = document.createElement('p');
    heading.textContent = room;

    document.querySelector('.chatBoxName').appendChild(heading);
}

function displayUsersCount(usersCount){
    document.querySelector('.users-count').textContent = usersCount
}

function displayRoomUsers(roomUsers){
    const usersList = document.createElement('ul');
    usersList.className = "list-users";
    
    roomUsers.forEach(user => {
        const listItem = document.createElement('li');
        listItem.innerHTML = user.username;
        usersList.appendChild(listItem)
    });

    document.querySelector('.room-users').appendChild(usersList)
}

function displayPasswordError(message){
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;

    document.querySelector('.errorBox').appendChild(errorMessage);
}

socket.on("new-user", (username, room, cb) => {
    displayMessage(`Welcome ${username} to ${room}`)
    displayChatBoxName(room)
    cb()
})

socket.on("receive-message", (message => {
    displayMessage(message)
}))

socket.on("disconnect", () => {
    console.log("Disconnected")
})

socket.on('currentRoomUsers', (usersCount) => {
    displayUsersCount(usersCount)
})

socket.on('displayCurrentRoomUsers', (roomUsers) => {
    displayRoomUsers(roomUsers)
})

socket.on('incorrect-password', errMsg => {
    displayPasswordError(errMsg);
})