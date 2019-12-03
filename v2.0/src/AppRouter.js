import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import NavBarBurger from './components/Menu/NavBarBurger'
import NavBarOffset from './components/Menu/NavBarOffset'
import Footer from './components/Menu/Footer'
import LoadingCircle from './components/Shared/LoadingCircle'
import './assets/css/style.css';

import HomePage from './components/Pages/HomePage/HomePage'
import ActionsPage from './components/Pages/ActionsPage/ActionsPage'
import OneActionPage from './components/Pages/ActionsPage/OneActionPage'
import AboutUsPage from './components/Pages/AboutUsPage/AboutUsPage'
import ServicesPage from './components/Pages/ServicesPage/ServicesPage'
import OneServicePage from './components/Pages/ServicesPage/OneServicePage'
import StoriesPage from './components/Pages/StoriesPage/StoriesPage'
import LoginPage from './components/Pages/LoginPage/LoginPage'
//import EventsPage from './components/Pages/EventsPage/EventsPage'
import EventsPage from './components/Pages/EventsPage/EventsPageReal'
import OneEventPage from './components/Pages/EventsPage/OneEventPage'
import ProfilePage from './components/Pages/ProfilePage/ProfilePage'
import ImpactPage from './components/Pages/ImpactPage/ImpactPage'
import TeamsPage from './components/Pages/TeamsPage/TeamsPage'
import RegisterPage from './components/Pages/RegisterPage/RegisterPage'
import PoliciesPage from './components/Pages/PoliciesPage/PoliciesPage'
import DonatePage from './components/Pages/DonatePage/DonatePage'
import ContactPage from './components/Pages/ContactUs/ContactUsPage';
import CommunitySelectPage from './components/Pages/CommunitySelectPage'
import Error404 from './components/Pages/Errors/404';
import {

	reduxLoadCommunity,
	reduxLoadHomePage,
	reduxLoadActionsPage,
	reduxLoadServiceProvidersPage,
	reduxLoadTestimonialsPage,
	reduxLoadTeamsPage,
	reduxLoadAboutUsPage,
	reduxLoadCommunitiesStats,
	reduxLoadDonatePage,
	reduxLoadEventsPage,
	reduxLoadMenu,
	reduxLoadPolicies,
	reduxLoadActions,
	reduxLoadEvents,
	reduxLoadServiceProviders,
	reduxLoadTestimonials,
	reduxLoadCommunities,
	reduxLoadRSVPs,
	reduxLoadTagCols,
	reduxLoadCommunityData,
	reduxLoadCollection,
	reduxLoadCommunityInformation
} from './redux/actions/pageActions'
import { reduxLogout,reduxLogin, reduxLoadTodo, reduxLoadDone } from './redux/actions/userActions';
import { reduxLoadLinks } from './redux/actions/linkActions';


import URLS from './api/urls'
import { getJson, apiCall, rawCall } from './api/functions'
import { connect } from 'react-redux';
import { isLoaded } from 'react-redux-firebase';

class AppRouter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			triedLogin: false
		}
	}
	componentDidMount() {
		var subdomain = this.props.match.params.subdomain;
		var body = { subdomain: subdomain };
		this.props.reduxLoadLinks({
			home: `/${subdomain}`,
			actions: `/${subdomain}/actions`,
			aboutus: `/${subdomain}/aboutus`,
			services: `/${subdomain}/services`,
			testimonials: `/${subdomain}/testimonials`,
			teams: `/${subdomain}/teams`,
			impact: `/${subdomain}/impact`,
			donate: `/${subdomain}/donate`,
			events: `/${subdomain}/events`,
			signin: `/${subdomain}/signin`,
			signup: `/${subdomain}/signup`,
			profile: `/${subdomain}/profile`,
			policies: `/${subdomain}/policies`,
			contactus: `/${subdomain}/contactus`
		}) 
		Promise.all([
			//Make sure to cleanup, and declare variables in Urls later
			//getJson(URLS.COMMUNITY + subdomain + '/pages?name=Home'),
			apiCall('home_page_settings.info', body, null),
			getJson(URLS.TEAMS_STATS + '?community__subdomain=' + subdomain),
			apiCall('about_us_page_settings.info', body, null),
			apiCall('donate_page_settings.info', body, null),
			apiCall('events.list', body, null),
			apiCall('actions.list',body),
			apiCall('vendors.list', body, null),
			apiCall('testimonials.list', body, null),
			getJson(URLS.MENUS),
			getJson(URLS.POLICIES),
			getJson(URLS.EVENT_ATTENDEES),
			apiCall("communities.info", { subdomain: subdomain }, null),
			getJson(URLS.TAG_COLLECTIONS),
			apiCall("graphs.actions.completed",body),
			getJson(URLS.V3 + 'tag_collections.listForSuperAdmin'),
			apiCall("communities.info", body, null),
			apiCall(URLS.V3_COMMUNITIES_STATS,body)
		]).then(myJsons => {
			this.props.reduxLoadHomePage(myJsons[0].data ? myJsons[0].data : null)
			this.props.reduxLoadTeamsPage(myJsons[1].data.length > 0 ? myJsons[1].data : null)
			this.props.reduxLoadAboutUsPage(myJsons[2].data ? myJsons[2].data : null)
			this.props.reduxLoadDonatePage(myJsons[3].data ? myJsons[3].data : null)
			this.props.reduxLoadEvents(myJsons[4].data)
			this.props.reduxLoadActions(myJsons[5].data)
			this.props.reduxLoadServiceProviders(myJsons[6].data)
			this.props.reduxLoadTestimonials(myJsons[7].data)
			this.props.reduxLoadMenu(myJsons[8].data)
			this.props.reduxLoadPolicies(myJsons[9].data)
			this.props.reduxLoadRSVPs(myJsons[10].data)
			//this.props.reduxLoadCommunities(myJsons[11].data)
			// this.props.reduxLoadCommunity(myJsons[11].data.filter(com => {
			// 	return com.subdomain === subdomain
			// })[0])
			this.props.reduxLoadCommunity(myJsons[11].data)
			this.props.reduxLoadTagCols(myJsons[12].data)
			this.props.reduxLoadCommunityData(myJsons[13].data)
			this.props.reduxLoadCollection(myJsons[14].data)
			this.props.reduxLoadCommunityInformation(myJsons[15].data)
			this.props.reduxLoadCommunitiesStats(myJsons[16].data)
		}).catch(err => {
			this.setState({ error: err })
			console.log(err)
		});
	}
	lowKeyErrorCheck(res,fallbackLink){
		//if the request comes in as signature expired
		//delete local token and sign user out, 
		//and run the same route again without token 
		if(res.error === "Signature has expired"){
			localStorage.removeItem('idToken');
			this.props.reduxLogout();
			return apiCall(fallbackLink).data
		}
		else{
			//if it has nothing to do with auth, just return whatever is coming from the server
			return res.data;
		}
	}
	async getUser(email) {
		const json = await getJson(`${URLS.USER}/e/${email}`);
		if (json && json.success && json.data) {
			this.props.reduxLogin(json.data);
			const todo = await getJson(`${URLS.USER}/e/${email}/actions?status=TODO`)
			this.props.reduxLoadTodo(todo.data);
			const done = await getJson(`${URLS.USER}/e/${email}/actions?status=DONE`)
			this.props.reduxLoadDone(done.data);
			return true;
		}
		else {
			console.log('no user');
			return false;
		}
	}
	render() {
		document.body.style.overflowX = 'hidden';

		if (!isLoaded(this.props.auth)) {
			return <LoadingCircle />;
		}
		if (!this.state.triedLogin && this.props.auth.uid && !this.props.user) {
			this.getUser(this.props.auth.email).then(success => {
				this.setState({
					triedLogin: true
				})
			})
		}
		if (this.props.auth.uid && !this.state.triedLogin) {
			console.log('user loading')
			return <LoadingCircle />;
		}
		const { links } = this.props;
		var finalMenu =[];
		if (this.props.menu) {
			const contactUsItem = { link: "/contactus", name: "Contact Us" };
			const navMenus = this.props.menu.filter(menu => { return menu.name === 'PortalMainNavLinks' })[0].content;
		 finalMenu =  [...navMenus, contactUsItem];
		}
		finalMenu = finalMenu.filter(item =>item.name !== "Home");
		const homeChil =[ 
			{ name:"current-home",link:"/"}, 
			{name: "All Communities",link:"http://"+window.location.host, special:true}
		];
		const droppyHome = {name:"Home",children:homeChil}
		finalMenu = [droppyHome,...finalMenu];
		//if (!this.state.loaded) return <LoadingCircle />;
		return (
			<div className="boxed-wrapper">
				<div className="burger-menu-overlay"></div>
				<Helmet>
					<meta charset="UTF-8" />
					<title>Mass Energize</title>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
				</Helmet>
				{this.props.menu ?
					<div>
						<NavBarBurger
							navLinks={finalMenu}
						/>
						<NavBarOffset />
					</div> : <LoadingCircle />
				}
				{ /**if theres a half finsished account the only place a user can go is the register page */
					(this.state.triedLogin && !this.props.user && this.props.auth.uid)
						|| (this.props.auth.uid && !this.props.auth.emailVerified) ?
						<Switch>
							<Route component={RegisterPage} />
						</Switch>
						:
						<Switch>
							<Route exact path={links.home} component={HomePage} />
							<Route exact path={`${links.home}/home`} component={HomePage} />
							<Route exact path={links.actions} component={ActionsPage} />
							<Route path={links.aboutus} component={AboutUsPage} />
							<Route exact path={links.services} component={ServicesPage} />
							<Route path={`${links.services}/:id`} component={OneServicePage} />
							<Route path={`${links.actions}/:id`} component={OneActionPage} />
							<Route path={links.testimonials} component={StoriesPage} />
							<Route path={links.teams} component={TeamsPage} />
							<Route path={links.impact} component={ImpactPage} />
							<Route path={links.donate} component={DonatePage} />
							<Route exact path={links.events} component={EventsPage} />
							<Route path={`${links.events}/:id`} component={OneEventPage} />
							<Route path={links.signin} component={LoginPage} />
							<Route path={links.signup} component={RegisterPage} />
							<Route path={links.profile} component={ProfilePage} />
							<Route path={links.policies} component={PoliciesPage} />
							<Route path={links.contactus} component={ContactPage} />
							<Route component={() => {
								return <Error404 />
							}} />
						</Switch>
				}
				{this.props.menu ?
					<Footer
						footerLinks={this.props.menu.filter(menu => { return menu.name === 'PortalFooterQuickLinks' })[0].content}
						footerInfo={this.props.menu.filter(menu => { return menu.name === 'PortalFooterContactInfo' })[0].content}
					/> : <LoadingCircle />
				}
			</div>
		);
	}
}
const mapStoreToProps = (store) => {
	return {
		user: store.user.info,
		auth: store.firebase.auth,
		user: store.user.info,
		menu: store.page.menu,
		links: store.links,
	}
}
const mapDispatchToProps = {
	reduxLogout,
	reduxLoadCommunity,
	reduxLoadHomePage,
	reduxLoadActionsPage,
	reduxLoadServiceProvidersPage,
	reduxLoadTestimonialsPage,
	reduxLoadTeamsPage,
	reduxLoadAboutUsPage,
	reduxLoadCommunitiesStats,
	reduxLoadDonatePage,
	reduxLoadEventsPage,
	reduxLoadMenu,
	reduxLoadPolicies,
	reduxLoadActions,
	reduxLoadEvents,
	reduxLoadServiceProviders,
	reduxLoadTestimonials,
	reduxLoadCommunities,
	reduxLogin,
	reduxLoadTodo,
	reduxLoadDone,
	reduxLoadRSVPs,
	reduxLoadTagCols,
	reduxLoadCommunityData,
	reduxLoadLinks,
	reduxLoadCollection,
	reduxLoadCommunityInformation
}
export default connect(mapStoreToProps, mapDispatchToProps)(AppRouter);