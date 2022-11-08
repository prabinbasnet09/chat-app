const express = require('express')
const { unwatchFile } = require('fs')
const http = require('http')
const path = require('path')
const url = require('url')
const base64id = require('base64id')

const socket = require('socket.io')
const utils = require('../client/utils/users.cjs')

const app = express()
const httpServer = http.createServer(app);
const io = socket(httpServer)

let username = ""
let room = ""
let g_password = ""

app.use(express.static(path.join(__dirname, '../client/public')))
app.use(express.static(path.join(__dirname, '../client/utils')))

app.use(express.urlencoded({extended: false}))

app.post('/rooms.html', (req, res) => {
    res.status(200).redirect('rooms.html')
})

app.post('/chatRoom.html', (req, res) => {
    //user authentication
    res.status(200).redirect('chatRoom.html')
    username =  req.body.username;
    room = req.body.roomName;
    g_password = req.body.group_password;
})


io.on('connection', (socket) => {

    socket.emit("new-user", username, room, () => {
        const user = utils.newUser(socket.id, username, room)
        // utils.getUsers()
        socket.join(room)
    })

    socket.on("send-message", (message) => { 
        const user = utils.getUser(socket.id)
        socket.to(user.currentRoom).emit("receive-message", message, room)
    })

    socket.on("joinRoom", (roomName, cb) => {
        if(socket.rooms.has(roomName)) return 
        socket.join(roomName)
        cb(`You joined ${roomName}`)
    })  
})

//override io.engine.generateId
// io.engine.generateId = req => {
//     const parsedUrl = new url.parse(req.url)
//     const prevId = parsedUrl.searchParams.get('socketId')
//     if(prevId){
//         return prevId
//     }
//     return base64id.generateId()
// }

httpServer.listen(3000, () => {
    console.log('Server running on port 3000')
})