const Logger = require('./utils/Logger');
const config = require('./config.json');

const WebSocketServer = require('./server/WebSocketServer');
const server = new WebSocketServer(config.ws);

console.log("Server ON");
Logger.info("Server started");


// SIGINT for windows platform
if (process.platform === "win32") {
    const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.on("SIGINT", () => {
        process.emit("SIGINT");
    });
}

// SIGINT for Linux
process.on("SIGINT", () => {
    // graceful shutdown
    console.log("Server shutdown");
    Logger.info("Server shutdown ", () => {
        server.destroy(() => {
            process.exit();
        });
    });

});