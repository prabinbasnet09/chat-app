const dayjs = require('dayjs')

function formatMessage(username, message){
    return {
        username,
        message,
        time: dayjs().format('h:mm a')
    }
}

module.exports = {formatMessage}