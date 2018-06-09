const Eos = require("eosjs");

const eos = Eos({httpEndpoint: 'http://eosio:8888', keyProvider: process.env.KEY_PROVIDER});

function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function pushAskAndBid(arr) {
    for (let item of arr) {
        const data_bid = {
            bidder: 'testers',
            bidType: 0,
            price: item[0],
            amount: 20
        };
        eos.transaction({
            actions: [
                {
                    account: 'decidex',
                    name: 'placebid',
                    authorization: [{
                        actor: 'decidex',
                        permission: 'active'
                    }],
                    data: data_bid
                }
            ]
        }).then(result => console.log(result));
        const data_ask = {
            bidder: "testers",
            bidType: 1,
            price: item[1],
            amount: 20
        };
        eos.transaction({
            actions: [
                {
                    account: 'decidex',
                    name: 'placebid',
                    authorization: [{
                        actor: 'decidex',
                        permission: 'active'
                    }],
                    data: data_ask
                }
            ]
        }).then(result => console.log(result));
    }
}

function pushRandomAskAndBid() {
    let arr = [];
    switch (randomIntInc(1, 3)) {
        case 1:
            for (let i = 0; i < 3; i++) {
                arr.push([randomIntInc(50, 60), randomIntInc(38, 50)])
            }
            console.log(arr);
            pushAskAndBid(arr);
            return;
        case 2:
            for (let i = 0; i < 3; i++) {
                arr.push([randomIntInc(4, 8), randomIntInc(1, 4)])
            }
            console.log(arr);
            pushAskAndBid(arr);
            return;
        case 3:
            for (let i = 0; i < 3; i++) {
                arr.push([randomIntInc(15, 20), randomIntInc(14, 15)])
            }
            console.log(arr);
            pushAskAndBid(arr);
            return;
    }
}

module.exports.pushRandomAskAndBid = pushRandomAskAndBid;