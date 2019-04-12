const WebSocket = require('ws');
const Logger = require('../../utils/Logger');

const UserData = require('../user/UserData');

function validateLogin(userName) {
    const allowed = new RegExp(/^[A-Za-z0-9-_&$.!]*$/);
    return allowed.test(userName);
}

function checkLogin(ws, json, usersArr) {
    if(json.$type==='login' && json.userName
        && json.userName.length>1 && json.userName.length<=30
        && json.userAvatar && json.userAvatar.length<100
        && validateLogin(json.userName)) {

        if(usersArr.find(user => user.getUserName()===json.userName)) {
            if (ws.readyState === WebSocket.OPEN) {
                const msg = JSON.stringify({$type:'login_failed', msg:'Failed to connect. Nickname already taken.'});
                ws.send(msg);
            }
            Logger.warn("Login phase. Nickname already taken | pid:"+ws._PID);
            return false;
        }
        return true;

    }else{
        Logger.warn("Login phase. Username not valid | pid:"+ws._PID);

        if (ws.readyState === WebSocket.OPEN) {
            const msg = JSON.stringify({$type:'login_failed', msg:'Nickname is not valid.'});
            ws.send(msg);
        }
    }
    return false;
}

function loginModule(loginTime, ws, usersArr, callbackSuccess) {

    ws.on('message', message => {
        const json = JSON.parse(message);
        if(!json.$type) {
            Logger.warn("Login phase. No $type | pid:"+ws._PID);
            return;
        }

        if(checkLogin(ws, json, usersArr)) {
            clearTimeout(loginTimeout);

            const userData = new UserData(ws._PID, ws);
            userData.setLoginDone(json.userName, json.userAvatar);

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(
                    {$type:'login_successful', user:userData.getUserData()}
                ));
            }
            ws.removeEventListener('message');
            ws.removeEventListener('close');

            Logger.info("Login done. userName:"+userData.getUserName()+" | pid:"+ws._PID);
            callbackSuccess(userData);

        }else{ // in case of wrong auth, disconnect
            ws.close();
        }
    });

    ws.on('close', () => {
        clearTimeout(loginTimeout);
    });

    const loginTimeout = setTimeout(()=> {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(
                {$type:'login_failed', msg:'Login timeout.'}
            ));
        }
        ws.close();
    }, loginTime);
}

module.exports = loginModule