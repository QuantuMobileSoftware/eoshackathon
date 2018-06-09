import React, {Component, Fragment} from 'react';
import Eos from "eosjs";

export class Bid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            price: 0,
            pk: "",
            accountName: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    render() {
        return (
                <Fragment>
                        <input type="number" name="amount" value={this.state.amount} onChange={this.handleInputChange} />
                        <input type="number" name="price" value={this.state.price} onChange={this.handleInputChange} />
                        <input type="text" name="pk" placeholder="pk" value={this.state.pk} onChange={this.handleInputChange} />
                        <input type="text" name="accountName" placeholder="Account name" value={this.state.accountName} onChange={this.handleInputChange} />
                        <input type="button" onClick={this.handleClickBuy} value="Buy"/>
                        <input type="button" onClick={this.handleClickSell} value="Sell"/>
                </Fragment>
                );
    }

    handleInputChange = (event) => {
        const target = event.target;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        if (name === "amount" || name === "price") {
            value = parseInt(value);
        }

        this.setState({
            [name]: value
        });
    }

    handleClickBuy = () => {
        const eos = Eos({
            httpEndpoint: 'http://' + window.location.hostname + ':8888',
            keyProvider: this.state.pk,
            debug: true
        });
        const data = {
            bidder: this.state.accountName,
            bidType: 0,
            price: this.state.price,
            amount: this.state.amount
        };
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
            keyProvider: this.state.pk,
            debug: true
        });
        const data = {
            bidder: this.state.accountName,
            bidType: 1,
            price: this.state.price,
            amount: this.state.amount
        };
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
        var self = this;
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