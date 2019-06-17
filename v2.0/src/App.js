import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './assets/css/style.css'
import {getHomePageData} from './api'


class App extends Component {
  render() {
    console.log(getHomePageData())
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Hey! <code>Welcome</code> to the Portal
          </p>
          <a
            className="App-link"
            href="https://massenergize.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Massenergize Portal Coming Soon
            {}
          </a>
        </header>
      </div>
    );
  }
}

export default App;
