import React, {Component, Fragment} from 'react';
import Eos from "eosjs";

export class Bid extends Component {
    render() {
        return (
                <Fragment>
                        <input type="number" id="amount" placeholder="0"/>
                        <input type="number" id="price" placeholder="0"/>
                        <input type="text" id="pk" placeholder="pk"/>
                        <input type="text" id="name" placeholder="Name"/>
                        <input type="button" onClick={this.handleClickBuy} value="Buy"/>
                        <input type="button" onClick={this.handleClickSell} value="Sell"/>
                </Fragment>
                );
    }

    handleClickBuy = () => {
        const eos = Eos({
            httpEndpoint: 'http://' + window.location.hostname + ':8888',
            keyProvider: document.getElementById('pk').value,
            debug: true
        });
        const amount = document.getElementById("amount").value;
        const price = document.getElementById("price").value;
        const name = document.getElementById("name").value;
        const data = {bidder: name, bidType: 1, price: parseInt(price), amount: parseInt(amount)};
        eos.transaction({
            actions: [
                {
                    account: 'decidex',
                    name: "placebid",
                    authorization: [{
                            actor: 'decidex',
                            permission: 'active'
                        }],
                    data: data
                }
            ]
        }).then(result => console.log(result));
    }

    handleClickSell = () => {
        const eos = Eos({
            httpEndpoint: 'http://' + window.location.hostname + ':8888',
            keyProvider: document.getElementById('pk').value,
            debug: true
        });
        const amount = document.getElementById("amount").value;
        const price = document.getElementById("price").value;
        const name = document.getElementById("name").value;
        const data = {bidder: name, bidType: 1, price: parseInt(price), amount: parseInt(amount)};
        eos.transaction({
            actions: [
                {
                    account: 'decidex',
                    name: "placebid",
                    authorization: [{
                            actor: 'decidex',
                            permission: 'active'
                        }],
                    data: data
                }
            ]
        }).then(result => console.log(result));
    }

    componentDidMount() {
        const controlWebsocket = new WebSocket("ws://" + window.location.hostname + ":1337/");
        controlWebsocket.onopen = function () {
        };
        controlWebsocket.onmessage = function (evt) {
            var message = JSON.parse(evt.data);
            console.log("controlWebsocket", message);
        };
        controlWebsocket.onclose = function () {
        };
    }
}
;