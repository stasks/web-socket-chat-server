class UserData {
    constructor(uid, ws) {
        this.uid = uid;
        this.ws = ws;
        this.loginDone = false;

        this.userName = null;
        this.userAvatar = null;
        this.lastActivity = 0;
        this.disconnectReason = 0;
    }

    getUID() {
        return this.uid;
    }

    getWS() {
        return this.ws;
    }

    isLogin() {
        return this.loginDone;
    }

    setLoginDone(userName, userAvatar) {
        this.userName = userName;
        this.userAvatar = userAvatar;
        this.loginDone = true;
        this.updateActivity();
    }

    getUserName() {
        return this.userName;
    }

    getUserData() {
        const data = {
            uid: this.uid,
            userName: this.userName,
            userAvatar: this.userAvatar,
        }
        return data;
    }

    updateActivity() {
        this.lastActivity = Date.now();
    }

    getLastActivity() {
        return this.lastActivity;
    }

    setDisconnectReason(reasonNum) {
        // 0 = user connection lost
        // 1 = user inactivity reason
        this.disconnectReason = reasonNum;
    }

    getDisconnectReason() {
        return this.disconnectReason;
    }
}

module.exports = UserData