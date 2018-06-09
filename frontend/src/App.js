import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Bid} from "./containers/Bid.js"

class App extends Component {
  render() {
    return (
      <div>
          <Bid></Bid>
      </div>
    );
  }
}

export default App;
