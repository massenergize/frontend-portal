import React from 'react';
import logo from '../../logo.png';
import { Link } from 'react-router-dom'
import { section } from '../../api/functions'
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
		//const header = this.props.pageData ? section(this.props.pageData, 'HomeHeader') : null;
		//const header =  null;
		const communitylogo = this.props.pageData.community.logo ? this.props.pageData.community.logo.url: null;
		const communityContact = this.props.pageData.community.owner_name ? this.props.pageData.community.logo.url: null;
		return (
			<div className="col-7 col-md-4">
				<div className="footer-widget about-column">
					<figure><Link to={this.props.links.home}>
						<img src={communitylogo ? communitylogo : logo} alt="" style={{ display: "inline-block" }} className='header-logo' />
					</Link></figure>
					<ul className="contact-info">
						{/* <li><span className="icon-e-mail-envelope"></span> {this.props.info.email}</li> 
						<li><span className="icon-phone-call"></span>{this.props.info.phone}</li>
						<li><span className="icon-people3"></span>{this.props.info.contactPerson}, <i>Community Contact</i></li> */}
						<li><span className="icon-phone-call"></span>{this.props.pageData.community.owner_phone}</li>
						<li><span className="icon-e-mail-envelope"></span> {this.props.pageData.community.owner_email}</li> 
						<li><span className="icon-people3"></span>{this.props.pageData.community.owner_name}, <i>Community Contact</i></li>
					</ul>
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