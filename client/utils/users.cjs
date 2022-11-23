const users = []

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
        return users.splice(index, 1)[0]
    }
}

module.exports = {newUser, getUser, roomUsers, getAllUsers, removeUser}