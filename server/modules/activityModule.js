const WebSocket = require('ws');
let inactivityTimer = 0;

function activityClear() {
    clearInterval(inactivityTimer);
}

function activityModule(inactivityTime, serverData) {

    inactivityTimer = setInterval(() => {
        const timeDiff = Date.now() - inactivityTime;
        const arr = serverData.usersArr.filter(user => user.getLastActivity() <= timeDiff);
        arr.map(user => {
            const ws = user.getWS();
            if (ws.readyState === WebSocket.OPEN) {
                const msg = JSON.stringify({$type:'server_msg', msg:'Disconnected by the server due to inactivity.'});
                ws.send(msg);
            }
            user.setDisconnectReason(1);
            ws.close();
        });

    }, inactivityTime);

}

module.exports = {
    activityModule,
    activityClear
}