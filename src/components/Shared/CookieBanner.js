import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class CookieBanner extends React.Component {
	displayCookieBanner = true;

	render() {
		return (
			(this.displayCookieBanner ? (<div className="cookie-banner sticky" style={{background:'#8DC62E', padding:'10px', position:'sticky', bottom:'0', width:'100%'}}>
				<div className="container-fluid">
					<div className="row ml-auto">
						<div className="col-lg-9 col-md-9 col-12">
							<div style={{color:'white', padding:'10px 15px'}}>We use cookies to provide the best experience we can. By using MassEnergize, you accept our cookie policy.</div>
						</div>
						<div className="col-lg-2 col-md-2 col-12">
							<button style={{color:'white', padding:'5px 10px'}}>Okay!</button>
							<button href="https://community.massenergize.org/ConcordMA/policies?name=Privacy%20Policy" style={{color:'white', padding:'5px 10px'}}>Cookie policy</button>
						</div>
						<div className="col-lg-1 col-md-1 col-12">
							<button style={{color:'white', padding:'5px 10px'}}>
								x
							</button>
						</div>
					</div>
				</div>
			</div>) : null)
		);
	}
}

export default CookieBanner;
