import React, { Component } from 'react';
import logo from './logo.svg';
import './assets/css/style.css';
import Action from './Components/Action.js';
import './App.css';
import './assets/css/style.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Action actionName="Test" actionDescription="This is a test action"></Action>
          <Action actionName="Test2" actionDescription="This is test action number 2"></Action>
          <a
            className="App-link"
            href="https://massenergize.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Massenergize Portal Coming Soon
          </a>
        </header>
      </div>
    );
  }
}

export default App;
