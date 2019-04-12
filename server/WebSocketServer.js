const WebSocket = require('ws');
const UID = require('../utils/UniqueId');
const Logger = require('../utils/Logger');
const UserData = require('./user/UserData');
const loginModule = require('./modules/loginModule');
const basicModule = require('./modules/basicModule');
const activityModule = require('./modules/activityModule').activityModule;
const activityClear = require('./modules/activityModule').activityClear;

const userActions = require('./actions/userActions');

class WebSocketServer {
    constructor(config) {

        const serverData = {
            usersArr: []
        }
        activityModule(config.inactivityTime, serverData);

        const wss = new WebSocket.Server({port:config.port});
        wss.on('connection', ws => {

            ws._PID = UID.generateID();
            Logger.info("New connection | pid:"+ws._PID);
            loginModule(config.loginTime, ws, serverData.usersArr, cbLoginDone);

            function cbLoginDone(userData) {
                serverData.usersArr.push(userData);

                userActions.sendUsersList(ws, userData, serverData.usersArr);
                userActions.sendAddUser(userData, serverData.usersArr);

                basicModule(ws, userData, serverData);
            }

        });
        this.wss = wss;
    }

    destroy(callback) {
        this.wss.close(callback);
    }
}

module.exports = WebSocketServer