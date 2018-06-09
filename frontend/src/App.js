import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Bit} from "./containers/Bit.js"

class App extends Component {
  render() {
    return (
      <div>
          <Bit></Bit>
      </div>
    );
  }
}

export default App;
