import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class CookieBanner extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			displayCookieBanner: true
		};
	  }
	

	acceptCookies = () => {
		this.setState({displayCookieBanner: false});
	}

	render() {
		return (
			(this.state.displayCookieBanner ? (<div className="cookie-banner" style={{
				position:'sticky',
				zIndex:'10',
				bottom:'0',
				width:'100%',
				padding:'10px',
				background:'#8DC62E'}}>
				<div className="container-fluid" style={{padding:'0px'}}>
					<div className="row ml-auto" style={{margin:'0px'}}>
						<div className="mr-auto" style={{width:'70%'}}>
							<div style={{color:'white', padding:'10px 15px'}}>
								We use cookies to provide the best experience we can for you. By using MassEnergize, you accept our cookie policy.
							</div>
						</div>
						<div className="ml-auto" style={{alignItems:'center'}}>
							<button onClick={this.acceptCookies} 
									class="cool-font new-sign-in float-right round-me z-depth-float" 
									style={{background:'white', color:'black'}}>
								Okay
							</button>
							<a href="https://community.massenergize.org/ConcordMA/policies?name=Privacy%20Policy" 
									class="cool-font new-sign-in float-right round-me z-depth-float" 
									style={{background:'white', color:'black'}}>
								Cookie policy
							</a>
						</div>
					</div>
				</div>
			</div>) : null)
		);
	}
}

export default CookieBanner;
