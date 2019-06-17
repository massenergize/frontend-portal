import React, { Component } from 'react';
import logo from './logo.svg';
import './assets/css/style.css';
import IconBoxTable from './Components/IconBoxTable.js';
import IconBox from './Components/IconBox.js';
//import './App.css';
import './assets/css/style.css'
import {getHomePageIconBoxes} from './api'


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <IconBoxTable 
            title = "IconBox Table Test"
            boxes = {getHomePageIconBoxes()}
          />
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
