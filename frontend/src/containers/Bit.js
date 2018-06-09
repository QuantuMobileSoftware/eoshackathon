import React, {Component, Fragment} from 'react';
import axios from "axios"
import Eos from "eosjs"

export class Bit extends Component {
    render() {
        return (
            <Fragment>
                <input type="number" id="val" placeholder="0"/>
                <input type="text" id="pk" placeholder="pk"/>
                <input type="button" onClick={this.handleClickSend} value="Send"/>
                <input type="button" onClick={this.handleClickSet} value="Set"/>
                <input type="button" onClick={this.handleClickSub} value="Sub"/>
            </Fragment>
        )
    }

    handleClickSend = () => {
        const eos = Eos({
            httpEndpoint: 'http://localhost:8888',
            keyProvider: document.getElementById('pk').value,
            debug: true
        });
        const val = document.getElementById("val").value;
        const data = {val : parseInt(val)};
        eos.transaction({
            actions: [
                {
                    account: 'decidex',
                    name: "add",
                    authorization: [{
                        actor: 'decidex',
                        permission: 'active'
                    }],
                    data: data
                }
            ]
        }).then(result => console.log(result));
    }
    handleClickSet = () => {
        const eos = Eos({
            httpEndpoint: 'http://localhost:8888',
            keyProvider: document.getElementById('pk').value,
            debug: true
        });
        const val = document.getElementById("val").value;
        const data = {val : parseInt(val)};
        eos.transaction({
            actions: [
                {
                    account: 'decidex',
                    name: "set",
                    authorization: [{
                        actor: 'decidex',
                        permission: 'active'
                    }],
                    data: data
                }
            ]
        }).then(result => console.log(result));
    }
    handleClickSub = () => {
        const eos = Eos({
            httpEndpoint: 'http://localhost:8888',
            keyProvider: document.getElementById('pk').value,
            debug: true
        });
        const val = document.getElementById("val").value;
        const data = {val : parseInt(val)};
        eos.transaction({
            actions: [
                {
                    account: 'decidex',
                    name: "subtract",
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

        // var controlWebsocket = new WebSocket("ws://" + window.location.hostname + ":1337/" + window.location.search);
        // this.setState({ws: controlWebsocket});
        // controlWebsocket.onopen = function () {
        // };
        // controlWebsocket.onclose = function () {
        // };
    }
}