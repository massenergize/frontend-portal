import React from 'react'
import RegisterForm from './RegisterForm'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import { connect } from 'react-redux'

class RegisterPage extends React.Component {
	render() { //avoids trying to render before the promise from the server is fulfilled  
		return (
			<perfect>

				<div className="boxed_wrapper">
					<BreadCrumbBar links={[{ name: 'Sign Up' }]} />
					<section className="register-section sec-padd-top" style={{ paddingTop: 5 }}>
						<div className="container">
							<div className="row">
								{/* <!--Form Column--> */}
								<div className="form-column column col-md-8 col-12 offset-md-2">
									<RegisterForm />
								</div>
							</div>
						</div>
					</section>
				</div>
			</perfect>
		);
	}
}
const mapStoreToProps = (store) => {
	return ({
		links: store.links
	});
}
export default connect(mapStoreToProps)(RegisterPage);