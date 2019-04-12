const Socket = require('ws');

function getTime() {
    const date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    return hour+":"+min;
}

function sendMessage(_PID, userName, usersList, json) {
    if(json.msg
        && (typeof json.msg === "string")
        && json.msg.length>0 && json.msg.length<500) {

        const msgData = {
            time: getTime(),
            userName,
            msg: json.msg
        }
        const msg = JSON.stringify({$type:'msg', data:msgData});
        usersList.map(userData => {
            const ws = userData.getWS();
            if (ws.readyState === Socket.OPEN) ws.send(msg);
        });
    }else{
        Logger.warn("Message data not valid | pid:"+_PID);
    }
}

module.exports = {
    sendMessage
}