const WebSocket = require('ws');
const Logger = require('../../utils/Logger');

const userActions = require('../actions/userActions');
const messageActions = require('../actions/messageActions');

function basicModule(ws, userData, serverData) {

    ws.on('message', message => {
        const json = JSON.parse(message);
        if(!json.$type) {
            Logger.warn("Auth message. No $type | pid:"+ws._PID);
            return;
        }
        switch(json.$type) {
            case 'msg':
                Logger.info("Message received | pid:"+ws._PID);
                userData.updateActivity();
                messageActions.sendMessage(ws._PID, userData.getUserName(), serverData.usersArr, json);
                break;
            default:
                Logger.info("Unknown $type received | pid:"+ws._PID);
        }
    });

    ws.on('close', () => {
        Logger.info("Connection close. Reason id:" + userData.getDisconnectReason() +" | pid:"+ws._PID);

        serverData.usersArr = serverData.usersArr.filter(user => user.getUID() !== userData.getUID());
        userActions.sendRemoveUser(userData.getUID(), userData.getUserName(), userData.getDisconnectReason(), serverData.usersArr);
    });

}

module.exports = basicModule