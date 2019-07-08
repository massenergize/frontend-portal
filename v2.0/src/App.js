import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './assets/css/style.css'
import {getHomePageData} from './api'
import {Link, Route} from 'react-router-dom';
import LoginPage from './pages/LoginPage'

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
          <Link className="App-link" to="/login">
            Massenergize Portal Coming Soon
            {}
          </Link>
        </header>
        <Route path="/login" component={LoginPage} exact />

      </div>
    );
  }
}

export default App;
