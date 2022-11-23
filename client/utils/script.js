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

    if(message === ""){
        return 
    }
    socket.emit("send-message", message)
})

document.querySelector(".leave").addEventListener('click', (event) => {
    socket.emit('update-userList', socket.id)
})

//display message on the sender side
function senderMessage(text){
    const messageContainer = document.createElement('div')
    messageContainer.className = "messageContainer";

    const message = document.createElement('div');
    
    message.textContent = text;
    message.className = "sender";

    messageContainer.appendChild(message)
    messageBox.appendChild(messageContainer);
    inputBox.value = ""
}

//display message on the receiver side
function displayMessage(text){
    const messageContainer = document.createElement('div')
    const message = document.createElement('div');
    messageContainer.className = "messageContainer";

    message.textContent = text;
    message.className = "receiver";

    messageContainer.appendChild(message)
    messageBox.appendChild(messageContainer);
    inputBox.value = ""
}

//chat-box heading
function displayChatBoxName(room){
    const heading = document.createElement('p');
    heading.textContent = room;

    document.querySelector('.chatBoxName').appendChild(heading);
}

//display room users count
function displayUsersCount(usersCount){
    document.querySelector('.users-count').textContent = usersCount
}

//display each users of a room 
function displayRoomUsers(roomUsers){
    const usersList = document.createElement('ul');
    usersList.className = "list-users";
    
    roomUsers.forEach(user => {
        const listItem = document.createElement('li');
        listItem.innerHTML = user.username;
        usersList.appendChild(listItem)
    });

    const onlineUsers = document.querySelector('.room-users');

    if(onlineUsers.children.length <= 0){
        onlineUsers.appendChild(usersList)
    }
    else{
        const oldChild = document.querySelector('.list-users')
        onlineUsers.replaceChild(usersList, oldChild)
    }
}

// throw password error message
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
    displayMessage(`${message.username}: ${message.message} ${message.time}`)
}))

socket.on("message-initiator", (message) => {
    senderMessage(`${message.message} ${message.time}`)
})
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