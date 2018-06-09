"use strict";

process.title = 'eoserver';

const webSocketServer = require('websocket').server,
        http = require('http'),
        fs = require('fs'),
        url = require('url'),
        path = require('path'),
        Eos = require('eosjs'),
        tradeEmulator = require('./tradeEmulator');

const eos = Eos({httpEndpoint: 'http://eosio:8888', keyProvider: process.env.KEY_PROVIDER});

const serverPort = parseInt(process.env.SERVER_PORT || 1337, 10);

var serveStatic = function (request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    const parsedUrl = url.parse(request.url, true);
    let pathname = `./${parsedUrl.pathname}`;
    var ext = path.parse(pathname).ext;
    const map = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword'
    };

    fs.exists(pathname, function (exist) {
        if (!exist) {
            response.statusCode = 404;
            response.end(`File ${pathname} not found!`);
            return;
        }

        if (fs.statSync(pathname).isDirectory()) {
            ext = '.html';
            pathname += '/index' + ext;
        }

        fs.readFile(pathname, function (err, data) {
            if (err) {
                response.statusCode = 500;
                response.end(`Error getting the file: ${err}.`);
            } else {
                response.setHeader('Content-type', map[ext] || 'text/plain');
                response.end(data);
            }
        });
    });
};

var server = http.createServer(function (request, response) {
    console.log((new Date()), `${request.method} ${request.url}`);
    serveStatic(request, response);
});

server.listen(serverPort, function () {
    console.log((new Date()), 'Server is listening on port', serverPort);
});

var wsServer = new webSocketServer({
    httpServer: server
});

var lastConnectionNumber = 0;
var activeConnections = {};
wsServer.on('request', function (request) {
    console.log((new Date()), 'Connection from origin', request.origin);
    const parsedUrl = url.parse(request.httpRequest.url, true);
    const connection = request.accept(null, request.origin);
    var connectionNumber = lastConnectionNumber++;
    activeConnections[connectionNumber] = connection;
    console.log((new Date()), 'Connection accepted', parsedUrl.query);
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            const parsedData = JSON.parse(message.utf8Data);
            console.log((new Date()), 'Got message', parsedData);
        }
    });
    connection.on('close', function () {
        console.log((new Date()), 'Peer disconnected');
        delete activeConnections[connectionNumber];
    });
});

setInterval(function () {
    eos.transaction({
        actions: [
            {
                account: 'decidex',
                name: 'match',
                authorization: [{
                        actor: 'decidex',
                        permission: 'active'
                    }],
                data: {
                    caller: 'decidex'
                }
            }
        ]
    }).then(result => console.log(result));
}, 5000);

function sendToAllConnectedPeers(message) {
    Object.values(activeConnections).forEach(function (connection) {
        connection.sendUTF(JSON.stringify(message));
    });
}

var bids = [];
setInterval(function () {
    eos.getTableRows("true", "decidex", "decidex", "bid", undefined, undefined, undefined, -1).then(result => {
        bids = result.rows;
        sendToAllConnectedPeers({bids: bids});
    });
}, 1000);

var orders = [];
setInterval(function () {
    eos.getTableRows("true", "decidex", "decidex", "order", undefined, undefined, undefined, -1).then(result => {
        orders = result.rows;
        if (orders === undefined || orders.length === 0) {
            return;
        }
        const intervalInMicros = 1 * 60 * 1000000;
        var aggregatedOrders = [];
        var periodStart = orders[0].createdat - orders[0].createdat % intervalInMicros;
        var periodOrders = [];
        orders.forEach((x) => {
            if (periodStart + intervalInMicros >= x.createdat) {
                periodOrders.push(x);
            } else {
                if (periodOrders.length > 0) {
                    aggregatedOrders.push({
                        date: periodStart,
                        volume: periodOrders.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0),
                        close: periodOrders.reduce((accumulator, currentValue) => currentValue.price, 0),
                        average: periodOrders.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0) / periodOrders.length
                    });
                }
                periodStart = x.createdat - x.createdat % intervalInMicros;
                periodOrders = [];
            }
        });
        if (periodOrders.length > 0) {
            aggregatedOrders.push({
                date: periodStart,
                volume: periodOrders.reduce((accumulator, currentValue) => accumulator + currentValue.amount, 0),
                close: periodOrders.reduce((accumulator, currentValue) => currentValue.price, 0),
                average: periodOrders.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0) / periodOrders.length
            });
        }
        periodOrders = [];
        var data = aggregatedOrders.map((x) => {
            return `${x.date/1000000},${x.volume},${x.close},${x.average}`;
        });
        data.unshift('Date,Volume,Close,Average');
        fs.writeFile('orders.csv.part', data.join('\n'), function (err) {
            if (err) {
                return console.log('write error: ' + err);
            }
            fs.rename('orders.csv.part', 'orders.csv', function (err) {
                if (err) {
                    return console.log('rename error: ' + err);
                }
            });
        });
//        sendToAllConnectedPeers({orders: orders});
    });
}, 1000);

// For DEMO purposes only
setInterval(tradeEmulator.pushRandomAskAndBid, 17000);