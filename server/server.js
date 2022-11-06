const { response } = require('express');
const express = require('express')
const http = require('http')
const socket = require('socket.io')

const app = express()
const httpServer = http.createServer(app);
const io = socket(httpServer, {
    cors: {
        origin: ["http://127.0.0.1:5501"],
    },
})

io.on('connection', (socket) => {
    // socket.broadcast.emit("Hello", "world")
    socket.on("send-message", message => {
        socket.broadcast.emit("receive-message", message)
    })

    socket.on("joinRoom", roomName => {
        socket.join(roomName)
        io.to("Dari Gang").emit("K xa dari haru")
    })

    
    
})

httpServer.listen(3000, () => {
    console.log('Server running on port 3000')
})