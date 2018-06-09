const WebSocket = require('ws');
const Eos = require("eosjs");

const wss = new WebSocket.Server({port: 8080, origin: '*'});
const eos = Eos({
    httpEndpoint: 'http://eosio:8888',
    keyProvider: "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3",
    debug: true
});

wss.on('connection', function connection(ws) {
    const getBids = () => {
        const rows = eos.getTableRows("true", "decidex", "decidex", "bid");
        ws.send(rows)
    };

    const getOrders = () => {
        const rows = eos.getTableRows("true", "decidex", "decidex", "order");
        ws.send(rows)
    };

    setInterval(getBids, 5000);
    setInterval(getOrders, 5000);

    // ws.on('message', function incoming(message) {
    //     console.log('received: %s', message);
    // });
    //
    // ws.send('something');
});