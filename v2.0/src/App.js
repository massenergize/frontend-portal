import React, { Component } from 'react';
import Helmet from 'react-helmet';
import {Switch, Route} from 'react-router-dom';

import './assets/css/style.css';

import HomePage from './Components/HomePage.js'
import ActionsPage from './Components/ActionsPage.js'

// import {
// 	getNavLinks,
// 	getWelcomeImagesData,
// 	getIconBoxesData,
// 	getGraphsData,
// 	getEventsData,
// 	getFooterData
// } from './api'

class App extends Component {
	render() {
		return (
			<div>
				<Helmet>
					<meta charset="UTF-8" />
					<title>Mass Energize</title>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
				</Helmet>
				<Switch>
					<Route exact path="/" path="/home" component={HomePage} />
					<Route path="/actions" component={ActionsPage}/>
					{/*<Route path="/contact" component={Contact} /> */}
					<Route component={()=>
						<div>
							FOUR OR FOR: NO PAGE FOUND
						</div>
					}/>
				</Switch>
			</div>
		);
	}
}
const fourofour = ()=> <div></div>
export default App;
