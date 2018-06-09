import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Bid} from "./containers/Bid.js";
import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react'

class App extends Component {
  render() {
    return (
      <Container>
          <Bid></Bid>
      </Container>
    );
  }
}

export default App;
