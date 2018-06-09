import React, { Component } from 'react';
import './App.css';
import {Bid} from "./containers/Bid.js";
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react'
import Logo from './logo.png'

class App extends Component {
    render() {
        return (
                <Container>
                    <img src={Logo} style={{margin: "3em 0"}} />
                    <Bid></Bid>
                </Container>
            );
    }
}

export default App;
