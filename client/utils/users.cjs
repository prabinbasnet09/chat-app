const users = []
const express = require('express')
const app = express()
const axios = require('axios')

const userAddURL = "https://82ijr18r2m.execute-api.us-east-1.amazonaws.com/prod/useradd";
const userRemoveURL = "https://82ijr18r2m.execute-api.us-east-1.amazonaws.com/prod/userremove";

const requestConfig = {
    headers: {
        'x-api-key': process.env.API_KEY
    }
}

function newUser(id, user_name, room_name){

    const oldUser = users.find((userInfo) => {
        if(userInfo.username === user_name){
            if(!(userInfo.room.includes(room_name))){
                userInfo.room.push(room_name) 
            }
            userInfo.user_id = id
            userInfo.currentRoom = room_name
            return userInfo
        } 
    })

    if(oldUser) 
        return oldUser

    const user = {
        user_id: id,
        username: user_name,
        room: [
            room_name
        ],
        currentRoom: room_name
    }
    users.push(user)

    const requestBody = {
        user_id: user.user_id,
        username: user.username,
        room: user.currentRoom
    }

    axios.post(userAddURL, requestBody, requestConfig).then(response => {
        return 
    }).catch(error => {
        console.log(error)
    })

    return user
}

function getUser(id){
    const user = users.find((userInfo) => {
        if(userInfo.user_id===id) 
            return userInfo
    })

    return user
}

function roomUsers(room){
    const onlineRoomUsers = users.filter(userInfo => userInfo.currentRoom === room)

    return onlineRoomUsers
}

function getAllUsers(){
    return users;
}

function removeUser(id){
    const index = users.findIndex(user => user.user_id === id)

    if(index !== -1) {
        const deletedUser = users.splice(index, 1)[0]

        const requestBody = {
            user_id: deletedUser.user_id,
            username: deletedUser.username,
            room: deletedUser.currentRoom
        }

        axios.delete(userRemoveURL, requestBody, requestConfig).then(response => {
            return
        }, error => {
            console.log(error)
        })

        return deletedUser
    }
}

function checkUser(username){
    return users.find((userInfo) => {
        if(userInfo.username===username) 
            return userInfo
    })
}

module.exports = {newUser, getUser, roomUsers, getAllUsers, removeUser, checkUser}