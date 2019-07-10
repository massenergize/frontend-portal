import React, { Component } from 'react';
import Helmet from 'react-helmet';
import {Switch, Route} from 'react-router-dom';
import CONST from './Components/Constants'
import NavBarBurger from './Components/Menu/NavBarBurger'
import NavBarOffset from './Components/Menu/NavBarOffset'
import Footer from './Components/Menu/Footer'
import LoadingCircle from './Components/Shared/LoadingCircle'
import './assets/css/style.css';

import HomePage from './Components/Pages/HomePage/HomePage'
import ActionsPage from './Components/Pages/ActionsPage/ActionsPage'
import OneActionPage from './Components/Pages/ActionsPage/OneActionPage'
import AboutUsPage from './Components/Pages/AboutUsPage/AboutUsPage'
import StoriesPage from './Components/Pages/StoriesPage/StoriesPage'
import LoginPage from './Components/Pages/LoginPage/LoginPage'
import EventsPage from './Components/Pages/EventsPage/EventsPage'
import OneEventPage from './Components/Pages/EventsPage/OneEventPage'
import ProfilePage from './Components/Pages/ProfilePage/ProfilePage'
import ImpactPage from './Components/Pages/ImpactPage/ImpactPage'

class App extends Component {

	constructor(props) {
        super(props);
        this.state = {
            menuData: null,
            userData: null,
        }
    }
    componentDidMount() {
        fetch(CONST.URL.MENU).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                menuData: myJson.menuData,
                userData: myJson.userData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
        
    }
	render() {
		if (!this.state.menuData) return <LoadingCircle/>;
        const {
            navLinks,
            navBarSticky,
            footerData,
        } = this.state.menuData;
		return (
			<div className="boxed-wrapper">
				<Helmet>
					<meta charset="UTF-8" />
					<title>Mass Energize</title>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
				</Helmet>
				<NavBarBurger
                    navLinks={navLinks}
                    userData={this.state.userData}
                    sticky={navBarSticky}
                />
                <NavBarOffset sticky={navBarSticky}/>
				<Switch>
					<Route exact path="/" 			component={HomePage} />
					<Route path="/home" 			component={HomePage} />
					<Route exact path="/actions"	component={ActionsPage}/>
					<Route path="/aboutus" 			component={AboutUsPage}/>
					<Route path="/actions/:id" 		component={OneActionPage}/>
					<Route path="/stories" 			component={StoriesPage}/>
					<Route exact path="/events" 	component={EventsPage}/>
					<Route path="/events/:id" 		component={OneEventPage}/>
					<Route path="/login" 			component={LoginPage}/>
					<Route path="/profile" 			component={ProfilePage}/>
					<Route path="/impact" 			component={ImpactPage}/>
					{/*<Route path="/contact" component={Contact} /> */}
					<Route component={()=>
						<div>
							FOUR OR FOR: PAGE NOT FOUND
						</div>
					}/>
				</Switch>
				<Footer
                    data={footerData}
                />
			</div>
		);
	}
}
export default App;
