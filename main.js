"use strict";

process.title = 'eoserver';

const webSocketServer = require('websocket').server,
        http = require('http'),
        fs = require('fs'),
        url = require('url'),
        path = require('path'),
        Eos = require('eosjs');

const eos = Eos({httpEndpoint: 'http://nodeosd:8888', keyProvider: '5JyiENJrnYr9dRy9TbxqD6yNDkpS5nD1qRHWpnCSDG97FC6A2wi'});

const serverPort = parseInt(process.env.SERVER_PORT || 1337, 10);

var serveStatic = function (request, response) {
    const parsedUrl = url.parse(request.url, true);
    let pathname = `./public${parsedUrl.pathname}`;
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

wsServer.on('request', function (request) {
    console.log((new Date()), 'Connection from origin', request.origin);
    const parsedUrl = url.parse(request.httpRequest.url, true);
    const connection = request.accept(null, request.origin);
    console.log((new Date()), 'Connection accepted', parsedUrl.query);
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            const parsedData = JSON.parse(message.utf8Data);
            console.log((new Date()), 'Got message', parsedData);
            eos.transaction({
                actions: [
                    {
                        account: 'decidex',
                        name: parsedData.name,
                        authorization: [{
                                actor: 'test',
                                permission: 'active'
                            }],
                        data: parsedData.data
                    }
                ]
            }).then(result => console.log(result));
        }
    });
    connection.on('close', function () {
        console.log((new Date()), 'Peer disconnected');
    });
});
