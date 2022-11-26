require('dotenv').config()
const express = require('express')
const http = require('http')
const path = require('path')
const axios = require('axios')
const socket = require('socket.io')
const utils = require('../client/utils/users.cjs')
const format = require('../client/utils/format.cjs')

const app = express()
const httpServer = http.createServer(app);
const io = socket(httpServer)

let username = ""
let room = ""
let g_password = ""

const backendURL = "https://82ijr18r2m.execute-api.us-east-1.amazonaws.com/prod/login";

const requestConfig = {
    headers: {
        'x-api-key': process.env.API_KEY
    }
}

app.use(express.static(path.join(__dirname, '../client/public')))
app.use(express.static(path.join(__dirname, '../client/utils')))

app.use(express.urlencoded({extended: false}))

app.post('/chatRoom.html', (req, res) => {
    //user authentication
    username =  req.body.username;
    room = req.body.roomName;
    g_password = req.body.group_password;

    if(utils.checkUser(username)){
        res.status(403).redirect('index.html')
    }
    else{

        const requestBody = {
            group_name: room,
            group_password: g_password
        }
        axios.post(backendURL, requestBody, requestConfig).then(response => {
            res.status(200).redirect('chatRoom.html')
        }).catch(error => {
            if(error.response.status === 403){
                res.redirect('/index.html')
            }
            console.log(error)
        })
    }
})


io.on('connection', (socket) => {
    socket.emit("new-user", username, room, () => {
        utils.newUser(socket.id, username, room)
        socket.join(room)
        io.to(room).emit("user-join", username)
        const roomUsers = utils.roomUsers(room);
        io.to(room).emit('currentRoomUsers', roomUsers.length)
        io.to(room).emit('displayCurrentRoomUsers', roomUsers)
    })

    socket.on("update-userList", (socketID) => {
        const removedUser = utils.removeUser(socketID);
        const room = removedUser.room[0]
        socket.leave(room)
        const roomUsers = utils.roomUsers(room);
        io.to(room).emit('currentRoomUsers', roomUsers.length)
        io.to(room).emit('displayCurrentRoomUsers', roomUsers)
        io.to(room).emit('user-left', removedUser.username)
    })

    socket.on("send-message", (message) => { 
        const user = utils.getUser(socket.id)
        socket.to(user.currentRoom).emit("receive-message", format.formatMessage(user.username, message), room)
        socket.emit("message-initiator", format.formatMessage(user.username, message), room)
    })
})

httpServer.listen(3000, () => {
    console.log('Server running on port 3000')
})