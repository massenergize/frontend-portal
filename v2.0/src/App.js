import React, { Component } from 'react';
import Helmet from 'react-helmet';
import './assets/css/style.css';

import IconBoxTable from './Components/IconBoxTable.js';
import NavBar from './Components/NavBar.js';
import WelcomeImages from './Components/WelcomeImages.js'
import Graphs from './Components/Graphs';
import {getNavLinks, getHomePageIconBoxes, getGraphsData} from './api'
import Footer from './Components/Footer';


class App extends Component {
//   componentDidMount () {
//     const script = document.createElement("script");

//     script.src = "./assets/js/custom.js";
//     script.async = true;

//     document.body.appendChild(script);
// }
  render() { 
    return (
      <div>
        <Helmet>
          <meta charset="UTF-8"/>
          <title>Mass Energize</title>

          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        </Helmet>

        <div className="boxed_wrapper">
          <NavBar navLinks = {getNavLinks()}/>
          <WelcomeImages/>
          <Graphs graphs={getGraphsData()}/>
          <IconBoxTable 
            title = "IconBox Table Test"
            boxes = {getHomePageIconBoxes()}
          />
          <Footer/>
        </div>
      </div>
    );
  }
}

export default App;
