import React, {Component, Fragment} from 'react';
import Eos from "eosjs";
import { Segment, Button, Form, Icon, Label, Menu, Table, Grid } from 'semantic-ui-react';

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

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    render() {
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
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            Ask
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Price</Table.HeaderCell>
                                        <Table.HeaderCell>Amount</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                {this.state.sellSide.map(function(bid){
                                    return <Table.Row key={bid.pkey}>
                                                <Table.Cell>{bid.price}</Table.Cell>
                                                <Table.Cell>{bid.amount}</Table.Cell>
                                              </Table.Row>;
                                })}
                                </Table.Body>
                            </Table>
                            Buy
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Price</Table.HeaderCell>
                                        <Table.HeaderCell>Amount</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                {this.state.buySide.map(function(bid){
                                    return <Table.Row key={bid.pkey}>
                                                <Table.Cell>{bid.price}</Table.Cell>
                                                <Table.Cell>{bid.amount}</Table.Cell>
                                              </Table.Row>;
                                })}
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                    </Grid>
                </Segment>
                );
    }

    handleChange = (e, { name, value }) => {
        console.log(name, value);
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
                sellSide.sort(function (a, b) {
                    return b.price - a.price;
                });
                self.setState({buySide: buySide, sellSide: sellSide});
            }
            if (message.orders !== undefined) {
                self.setState({orders: message.orders});
            }
        };
        controlWebsocket.onclose = function () {
        };
    }
}
;