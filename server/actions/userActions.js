const Socket = require('ws');

function sendUsersList(ws, userData, usersArr) {
    // Send all user to new user
    const users = usersArr.map(userData => {
        return userData.getUserData()
    });
    if (ws.readyState === Socket.OPEN) {
        const msg = JSON.stringify({$type:'users_list', users});
        ws.send(msg);
    }
}

function sendAddUser(userData, usersArr) {
    // Send new user to others
    const notThisUID = userData.getUID();
    const msg = JSON.stringify({$type:'user_add', user:userData.getUserData()});
    usersArr.map(user => {
        if(user.getUID()!==notThisUID) {
            const ws = user.getWS();
            if (ws.readyState === Socket.OPEN) ws.send(msg);
        }
    });
}

function sendRemoveUser(userUID, userName, reasonID, usersArr) {
    let reasonMsg = null;
    switch(reasonID) {
        case 0:
            reasonMsg = userName + ' left the chat, connection lost';
            break;
        case 1:
            reasonMsg = userName + ' was disconnected due to inactivity';
            break;
    }
    const msg = JSON.stringify({$type:'user_remove', userUID, reasonMsg});
    usersArr.map(user => {
        const ws = user.getWS();
        if (ws.readyState === Socket.OPEN) ws.send(msg);
    });
}

module.exports = {
    sendUsersList,
    sendAddUser,
    sendRemoveUser
}