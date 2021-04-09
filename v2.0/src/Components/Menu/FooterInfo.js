import React from 'react';
import logo from '../../logo.png';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'



/** Renders the address/ company contact info in the footer
 * @props :
    info
        phone
        email
        contactPerson
        contactPersonLink
*/

class FooterInfo extends React.Component {

	render() {
		const { pageData } = this.props;
		const { community } = pageData || {};
		var communitylogo = community && community.logo && community.logo.url;
		return (
			<div className="col-7 col-md-4">
				<div className="footer-widget about-column">
					<figure><Link to={this.props.links.home}>
						<img src={communitylogo ? communitylogo : logo} alt="LOGO" style={{ display: "inline-block" }} className='header-logo' />
					</Link></figure>
					<ul className="contact-info">
						<li><span className="icon-people3"></span>{this.props.info.name}, <i>{'  '}Community Organizer</i></li>
						{this.props.info.email &&
							<li><span className="icon-e-mail-envelope"></span><Link className="energize-link" to={`/${community.subdomain}/contactus`}>Click to email Community Organizer </Link> </li>
						}
						{this.props.info.phone &&
							<li><span className="icon-phone-call"></span>{this.props.info.phone}</li>
						}
					</ul>
					<div> <a className="energize-link" href={this.props.info.allCommunities.link}>{this.props.info.allCommunities.name} </a></div>
				</div>
			</div>
		);
	}
}
const mapStoreToProps = (store) => {
	return {
		pageData: store.page.homePage,
		links: store.links
	}
}
export default connect(mapStoreToProps, null)(FooterInfo);