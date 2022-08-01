'use strict';

// const = {
//     exitHandler: function (options, err) {
//
//     }
// }

const connections = {
    close: async function () {
        // await delay(1000)
        console.log('closed connection');
        return Promise.resolve();
    }
};

function delay(ms = 3000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


class ServerUtil {
    server;
    constructor(server) {
        this.server = server;

        this.EVENTS = {
            EXIT: 'exit',
            SIGINT: 'SIGINT',
            SIGTERM: 'SIGTERM',
            UNCAUGHT_EXCEPTION: 'uncaughtException'
        }
    }

    handler(options, err) {
        console.log('---------------');
        console.log('options', options);
        console.log('err', err);
        console.log('---------------');
        this.server.close(async () => {
            // await pkCore.connect.exit();
            await connections.close()
            console.log('before close server');
            process.exit(0);
        });
    }

    // logError

    setupListeners() {
        // GRACEFULL SHUTDOWN
        process.stdin.resume();//so the program will not close instantly

        //do something when app is closing
        process.on(this.EVENTS.EXIT, this.handler.bind(this, {exit: true, event: "exit"}));

        //catches ctrl+c event
        process.on(this.EVENTS.SIGINT, this.handler.bind(this, {exit: true, event: "SIGINT"}));
        process.on(this.EVENTS.SIGTERM, this.handler.bind(this, {exit: true, event: "SIGTERM"}));

        //catches uncaught exceptions
        // process.on(this.EVENTS.UNCAUGHT_EXCEPTION, this.handler.bind(this, {exit: false, event: "uncaughtException"}));


        process.on('uncaughtExceptionMonitor', (err, origin) => {
            console.log('---------------');
            console.log('uncaughtExceptionMonitor');
            console.log(err);
            console.log(origin);
        });
    }

}

module.exports = ServerUtil;
