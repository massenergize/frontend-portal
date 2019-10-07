import React from 'react'
import FooterInfo from './FooterInfo'
import FooterLinks from './FooterLinks'
import { Link } from 'react-router-dom'
import SubscribeForm from './SubscribeForm';
import { connect } from 'react-redux'
/**
 * Footer section has place for links, 
 */
class Footer extends React.Component {
	render() {
		return (
			<div className="d-flex flex-column">
				<footer className="main-footer m-footer-color">
					{/* <!--Widgets Section--> */}
					<div className="widgets-section">
						<div className="container">
							{/* <!--Big Column--> */}
							<div className="big-column">
								<div className="row clearfix">
									{/* <!--Footer Column--> */}
									<FooterInfo
										info={this.props.footerInfo ? this.props.footerInfo : {}}
									/>
									{/* <!--Footer Column--> */}
									<FooterLinks
										title="Quick Links"
										links={this.props.footerLinks}
									/>
									{/* <!--Footer Column--> */}
									<div className="col-12 col-md-4">
										<SubscribeForm />
									</div>
								</div>
							</div>
						</div>
					</div>
				</footer>
				<section className="footer-bottom m-footer-color">
					<div className="container">
						<div className="pull-left copy-text">
							<p className="cool-font"><a href="https://massenergize.org">Copyrights © 2019</a> All Rights Reserved. Powered by <a href="https://massenergize.org">MassEnergize</a></p>

						</div>
						<div className="pull-right get-text">
							<Link to={this.props.links.donate}>Donate Now</Link>
						</div>
					</div>
				</section>
				<section className="coders " style={{ background: 'black' }}>
					<div className="container">
						<p className="m-0" style={{ fontSize: '12px' }}>Made with&nbsp;
                            <span className="fa fa-heart text-danger"></span> by&nbsp;
                            <a className="normal">
								<u>Sam Opoku-Agyemang</u>
							</a>,&nbsp;
                            <a className="normal">
								<u>Kieran O'Day</u>
							</a>,&nbsp;
                            <a className="normal">
								<u>Mingle Li</u>
							</a>
							.
                        </p>
					</div>
				</section>
			</div>
		);
	}
}
const mapStoreToProps = (store) => {
	return ({
		links: store.links
	});
}
export default connect(mapStoreToProps)(Footer);