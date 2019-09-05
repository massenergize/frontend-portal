import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import './assets/css/style.css'
import AppRouter from './AppRouter'
import { connect } from 'react-redux'
import { reduxLoadCommunities } from './redux/actions/pageActions'
import {getJson} from './api/functions'
import URLS from './api/urls'
import CommunitySelectPage from './Components/Pages/CommunitySelectPage';
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null
		}
	}
	componentDidMount() {
		getJson(URLS.COMMUNITIES).then(json => {
			if (json.success) {
				this.props.reduxLoadCommunities(json.data);
			}
		}).catch(err => this.setState({ error: err }))
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

const mapDispatchToProps = {
	reduxLoadCommunities
}
export default connect(null, mapDispatchToProps)(App);