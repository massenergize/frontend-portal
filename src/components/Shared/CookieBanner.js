import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class CookieBanner extends React.Component {
	render() {
		return (
			<div className="cookie-banner sticky" style={{background:'#8DC62E', padding:'10px', position:'sticky', bottom:'0', width:'100%'}}>
				<div className="container-fluid">
					<div className="row">
						<div className="col-lg-8 col-md-7 col-12">
							<div style={{color:'white', padding:'10px 15px'}}>We use cookies to provide the best experience we can. By using MassEnergize, you accept our cookie policy.</div>
						</div><div className="col-lg-4 col-md-5 col-12 ml-auto">
							<button style={{color:'white', padding:'5px 10px'}}>Okay!</button>
							<button style={{color:'white', padding:'5px 10px'}}>Cookie policy</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CookieBanner;
