import React, { Component } from 'react';
import {RadialBarChart} from 'recharts';
import Helmet from 'react-helmet';
import './assets/css/style.css';

import IconBoxTable from './Components/IconBoxTable.js';
import NavBar from './Components/NavBar.js';
import WelcomeImages from './Components/WelcomeImages.js'
import CircleGraph from './Components/CircleGraph.js';
import {getHomePageIconBoxes, getNavLinks} from './api'


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

          <link rel="stylesheet" href="/assets/css/style.css"/>
          <link rel="stylesheet" href="/asstes/css/responsive.css"/>
          <script src = "./assets/js/custom.js"></script>
        </Helmet>

        <div className="boxed_wrapper">
          <NavBar navLinks = {getNavLinks()}/>
          <WelcomeImages/>

          <RadialBarChart
            width = {100}
            height = {100}
            startAngle = {0}
            endAngle = {360}
            innerRadius = "80%"
            outerRadius = "100%"
            data = {{
              name: "Houses Engaged",
              uv: 400,
              fill: "#8884d8"
            }}
          ></RadialBarChart>

          <IconBoxTable 
            title = "IconBox Table Test"
            boxes = {getHomePageIconBoxes()}
          />
        </div>
      </div>
    );
  }
}

export default App;
