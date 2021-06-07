import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import './assets/css/style.css'
import AppRouter from './AppRouter'
import { connect } from 'react-redux'
import { reduxLoadCommunities } from './redux/actions/pageActions'
import { apiCall } from './api/functions'
import CommunitySelectPage from './Components/Pages/CommunitySelectPage';
import { reduxLogout } from './redux/actions/userActions'
// import firebase from "./config/firebaseConfig";
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null
		}
	}
	componentDidMount() {
		apiCall("communities.list").then(json => {
			if (json.success) {
				this.props.reduxLoadCommunities(json.data);
			}
		}).catch(err => this.setState({ error: err.message }))
	}
	render() {
	
		return (
			<>
				{this.state.error ?
					<>
						{this.showError(this.state.error)}
					</>
					:
					<Switch>
						<Route path='/:subdomain' component={AppRouter} />
						<Route component={CommunitySelectPage}/>
					</Switch>
				}
			</>
		)
	}
	showError = (error) => {
		return (
			<p className='text-center text-danger'> {error} </p>
		)
	}
}
const mapStateToProps = (store)=>{
	return {
		user: store.user, 
	
	}
}
const mapDispatchToProps = {
	reduxLoadCommunities,
	reduxLogout
}
export default connect(mapStateToProps, mapDispatchToProps)(App);