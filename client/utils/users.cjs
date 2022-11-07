const users = []
const rooms = []

function newUser(user){
    if(users.find(user.username)) return 
    users.push(user)
}

module.exports = {newUser}