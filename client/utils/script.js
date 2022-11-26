const socket = io()

const burger = document.querySelector('.burger');

burger.addEventListener("click", navToogle);

function navToogle(event){
    event.preventDefault();
    document.querySelector('.online-users').classList.toggle("active");
    burger.classList.toggle("active");
}

document.querySelector('.close-btn').addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.online-users').classList.toggle("active");
    burger.classList.toggle("active");
})
const messageBox = document.querySelector('.chatAppMessage')
const inputBox = document.querySelector('.inputBox')

document.querySelector('.clearChatBox').addEventListener('click', (event)=> {
    event.preventDefault();
    let clearAll = confirm("Are you sure you want to clear all chat messages?");
    if(clearAll){
        messageBox.innerHTML = ""
    } else{
        return
    }
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
    let leaveGroup = confirm("Are you sure you want to leave the chat?");
    
    if(leaveGroup){
        socket.emit('update-userList', socket.id)
        document.getElementsByTagName('a')[0].href = "index.html";
    } 
    else{
        document.querySelector('.online-users').classList.toggle("active");
        burger.classList.toggle("active")
        event.preventDefault();
    }
})

//server message
function JoinAndLeave(username, status){
    const userStatus = document.createElement('div');
    userStatus.className = "userStatus"

    if(status === "join")
        userStatus.textContent = `${username} has joined the chat!`
    else
        userStatus.textContent = `${username} has left the chat!`

    messageBox.appendChild(userStatus)
    messageBox.scrollTop = messageBox.scrollHeight;
}

//display message 
function displayMessage(message, messageCondition){
    const messageContainer = document.createElement('div')
    messageContainer.className = "messageContainer";

    const messageContent = document.createElement('div');
    const messageSubContent = document.createElement('span');

    if(messageCondition === "incoming"){    
        messageContent.textContent = `${message.message}`;
        messageSubContent.textContent = `${message.username} | ${message.time}`;
        
        messageContent.className = "receiver";
        messageSubContent.className = "receiver-subHead";
    } else{
        messageContent.textContent = `${message.message}`;
        messageSubContent.textContent = `You | ${message.time}`

        messageContent.className = "sender";
        messageSubContent.className = "sender-subHead";
    }

    messageContainer.append(messageContent, messageSubContent)
    messageBox.appendChild(messageContainer);
    inputBox.value = ""
    messageBox.scrollTop = messageBox.scrollHeight;
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
        listItem.className = "userName";
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
    displayChatBoxName(room)
    cb()
})

socket.on('user-join', (username) => JoinAndLeave(username, "join"))

socket.on("receive-message", (message => displayMessage(message, "incoming")))

socket.on("message-initiator", (message) => displayMessage(message, "outgoing"))

socket.on("disconnect", () => console.log("Disconnected"))

socket.on('currentRoomUsers', (usersCount) => displayUsersCount(usersCount))

socket.on('displayCurrentRoomUsers', (roomUsers) => displayRoomUsers(roomUsers))

socket.on('incorrect-password', errMsg => displayPasswordError(errMsg))

socket.on('user-left', (username) => JoinAndLeave(username, "left"))