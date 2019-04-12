const fs = require('fs');

class Logger {
    formatDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        return year+"_"+month+"_"+day;
    }

    writeMsg(type, msg, callback) {
        const date = new Date();
        const tmpMsg = type +" "+ date.toISOString().replace(/T/, ' ').replace(/\..+/, '') +" | " + msg+"\n";

        const fileName = "log_"+this.formatDate(date)+".txt";

        fs.appendFile("./logs/"+fileName, tmpMsg, (err) => {
            if(callback) callback();
            if(err) {
                console.log('Write log error: ', err);
            }
        });
    }

    info(msg, callback) {
        this.writeMsg("INFO", msg, callback);
    }

    warn(msg, callback) {
        this.writeMsg("WARN", msg, callback);
    }

    error(msg, callback) {
        this.writeMsg("ERROR", msg, callback);
    }
}

module.exports = new Logger();