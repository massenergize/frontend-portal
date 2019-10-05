import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import NavBarBurger from './Components/Menu/NavBarBurger'
import NavBarOffset from './Components/Menu/NavBarOffset'
import Footer from './Components/Menu/Footer'
import LoadingCircle from './Components/Shared/LoadingCircle'
import './assets/css/style.css';

import HomePage from './Components/Pages/HomePage/HomePage'
import ActionsPage from './Components/Pages/ActionsPage/ActionsPage'
import OneActionPage from './Components/Pages/ActionsPage/OneActionPage'
import AboutUsPage from './Components/Pages/AboutUsPage/AboutUsPage'
import ServicesPage from './Components/Pages/ServicesPage/ServicesPage'
import OneServicePage from './Components/Pages/ServicesPage/OneServicePage'
import StoriesPage from './Components/Pages/StoriesPage/StoriesPage'
import LoginPage from './Components/Pages/LoginPage/LoginPage'
import EventsPage from './Components/Pages/EventsPage/EventsPage'
import OneEventPage from './Components/Pages/EventsPage/OneEventPage'
import ProfilePage from './Components/Pages/ProfilePage/ProfilePage'
import ImpactPage from './Components/Pages/ImpactPage/ImpactPage'
import TeamsPage from './Components/Pages/TeamsPage/TeamsPage'
import RegisterPage from './Components/Pages/RegisterPage/RegisterPage'
import PoliciesPage from './Components/Pages/PoliciesPage/PoliciesPage'
import DonatePage from './Components/Pages/DonatePage/DonatePage'
import CommunitySelectPage from './Components/Pages/CommunitySelectPage'

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
	reduxLoadCommunityData
} from './redux/actions/pageActions'
import { reduxLogin, reduxLoadTodo, reduxLoadDone } from './redux/actions/userActions';
import { reduxLoadLinks } from './redux/actions/linkActions';


import URLS from './api/urls'
import { getJson } from './api/functions'
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
		})
		Promise.all([
			getJson(URLS.COMMUNITY + subdomain + '/pages?name=Home'),
			getJson(URLS.TEAMS_STATS + '?community__subdomain=' + subdomain),
			getJson(URLS.COMMUNITY + subdomain + '/pages?name=AboutUs'),
			getJson(URLS.COMMUNITY + subdomain + '/pages?name=Donate'),
			getJson(URLS.COMMUNITY + subdomain + '/events'),
			getJson(URLS.COMMUNITY + subdomain + '/actions'),
			getJson(URLS.COMMUNITY + subdomain + '/vendors'),
			getJson(URLS.COMMUNITY + subdomain + '/testimonials'),
			getJson(URLS.MENUS),
			getJson(URLS.POLICIES),
			getJson(URLS.EVENT_ATTENDEES),
			getJson(URLS.COMMUNITIES),
			getJson(URLS.TAG_COLLECTIONS),
			getJson(URLS.COMMUNITY + subdomain + '/data'),
		]).then(myJsons => {
			this.props.reduxLoadHomePage(myJsons[0].data.length > 0 ? myJsons[0].data[0] : null)
			this.props.reduxLoadTeamsPage(myJsons[1].data.length > 0 ? myJsons[1].data : null)
			this.props.reduxLoadAboutUsPage(myJsons[2].data.length > 0 ? myJsons[2].data[0] : null)
			this.props.reduxLoadDonatePage(myJsons[3].data.length > 0 ? myJsons[3].data[0] : null)
			this.props.reduxLoadEvents(myJsons[4].data)
			this.props.reduxLoadActions(myJsons[5].data)
			this.props.reduxLoadServiceProviders(myJsons[6].data)
			this.props.reduxLoadTestimonials(myJsons[7].data)
			this.props.reduxLoadMenu(myJsons[8].data)
			this.props.reduxLoadPolicies(myJsons[9].data)
			this.props.reduxLoadRSVPs(myJsons[10].data)
			this.props.reduxLoadCommunities(myJsons[11].data)
			this.props.reduxLoadCommunity(myJsons[11].data.filter(com => {
				return com.subdomain === subdomain
			})[0])
			this.props.reduxLoadTagCols(myJsons[12].data)
			this.props.reduxLoadCommunityData(myJsons[13].data)
		}).catch(err => {
			this.setState({ error: err })
			console.log(err)
		});
	}
	async getUser(email) {
		const json = await getJson(`${URLS.USER}/e/${email}`);
		if (json.success && json.data) {
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
			console.log('auth loading')
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
							navLinks={this.props.menu.filter(menu => { return menu.name === 'PortalMainNavLinks' })[0].content}
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
							{/*<Route path="/contact" component={Contact} /> */}
							<Route component={() => {
								return <div>
									404 Error: Page not Found
								</div>
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
		auth: store.firebase.auth,
		user: store.user.info,
		menu: store.page.menu,
		links: store.links,
	}
}
const mapDispatchToProps = {
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
	reduxLoadLinks
}
export default connect(mapStoreToProps, mapDispatchToProps)(AppRouter);