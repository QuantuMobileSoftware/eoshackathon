import React, {Component} from 'react';
import Eos from "eosjs";
import { Segment, Button, Form, Grid } from 'semantic-ui-react';
import Chart from "../components/Chart";
import BidsTable from "../components/BidsTable";

export class Bid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            price: 0,
            pk: "",
            accountName: "",
            sellSide: [],
            buySide: []
        };
        
        this.state.orders = [
            {
                date: new Date(),
                open: 9,
                high: 15,
                low: 6,
                close: 14,
                volume: 32
            }
        ];

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    render() {
        this.ordersChart = <Chart />;
        return (
                <Segment inverted>
                    <Grid stackable>
                        <Grid.Column width={3}>
                            <Form inverted>
                                    <Form.Input name='accountName' label='Account name' type='text' value={this.state.accountName} onChange={this.handleChange} />
                                    <Form.Input name='pk' label='pk' type='password' value={this.state.pk} onChange={this.handleChange} />
                                    <Form.Input name='amount' label='Amount' type='number' value={this.state.amount} onChange={this.handleChange} />
                                    <Form.Input name='price' label='Price' type='number' value={this.state.price} onChange={this.handleChange} />
                                    <Button basic color='green' onClick={this.handleClickSell}>Sell</Button>
                                    <Button basic color='red' onClick={this.handleClickBuy}>Buy</Button>
                                    <Form.Input name='amount' label='Amount' type='number' value={this.state.amount} onChange={this.handleChange} />
                                    <Button basic color='red' onClick={this.handleClickMarketBuy}>Market buy</Button>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <BidsTable sellSide={this.state.sellSide} buySide={this.state.buySide} />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            {this.ordersChart}
                        </Grid.Column>
                    </Grid>
                </Segment>
                );
    }

    handleChange = (e, { name, value }) => {
        if (name === "amount" || name === "price") {
            value = parseInt(value);
        }
        this.setState({[name]: value});
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
    
    handleClickMarketBuy = () => {
        const eos = Eos({
            httpEndpoint: 'http://' + window.location.hostname + ':8888',
            keyProvider: this.state.pk,
            debug: true
        });
        const data = {
            bidder: this.state.accountName,
            amount: this.state.amount
        };
        eos.transaction({
            actions: [
                {
                    account: 'decidex',
                    name: "marketsell",
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
            if (message.bids !== undefined) {
                var buySide = [];
                var sellSide = [];
                message.bids.forEach(x => {
                    if (x.bidType === 0) {
                        buySide.push(x);
                    } else {
                        sellSide.push(x);
                    }
                });
                buySide.sort(function (a, b) {
                    return b.price - a.price;
                });
                buySide = buySide.slice(0, Math.min(buySide.length, 5));
                sellSide.sort(function (a, b) {
                    return b.price - a.price;
                });
                sellSide = sellSide.slice(Math.max(sellSide.length - 5, 1));
                self.setState({buySide: buySide, sellSide: sellSide});
            }
            if (message.orders !== undefined) {
                
//                self.setState({orders: message.orders});
            }
        };
        controlWebsocket.onclose = function () {
        };
    }
}
;