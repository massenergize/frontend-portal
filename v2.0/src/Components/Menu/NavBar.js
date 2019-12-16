import React from 'react';
import logo from '../../logo.png';
import '../assets/css/style.css';
import NavBarBurger from './NavBarBurger'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

/**
 * Renders the Navigation bar 
 * @props
 *      navLinks
 *          link
 *          name
 *      userData
 *          name
 *          email
 *          ...
 */
class NavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			burger: false,
			collapsed: true
		}
	}
	renderNavLinks(navLinks) {
		if (!navLinks) {
			return <li>No PageLinks to Display</li>
		}
		const { links } = this.props
		return Object.keys(navLinks).map(key => {
			var navLink = navLinks[key];
			return <li key={navLink.name}><Link to={`${links.home}/${navLink.link}`}>{navLink.name}</Link></li>
		});
	}
	render() {
		const { links } = this.props
		console.log("I am th el inlkns", links);
		return (
			<div>
				<nav className="theme_menu navbar stricky">
					<div className="container">
						<div className="row">
							<div className="col-lg-2 col-md-2 col-sm-2 col-xs-12">
								<div className="main-logo">
									<Link to={`${links.home}`}><img src={logo} alt="" /></Link>
								</div>
							</div>
							<div className="col-lg-10 col-md-10 col-sm-10 col-xs-12 menu-column">
								<nav className="menuzord" id="main_menu">
									<ul className="menuzord-menu">
										{this.renderNavLinks(this.props.navLinks)}
										{this.renderLogin()}
									</ul>
								</nav>
							</div>
						</div>
					</div>
				</nav>
			</div>
		);
	}
	renderLogin() {
		const {
			loggedIn,
			name
		} = this.props.userData
		const { links } = this.props
		if (loggedIn) {
			return (
				<li>
					<a style={{ color: "#8ec449" }}>
						<i className="fa fa-user" />
						Welcome: <br />
						{name}
					</a>
				</li>
			);
		} else {
			return (
				<li >
					<Link to={`${links.signin}`} className="thm-btn float-right" >
						<i className="fa fa-user" style={{ padding: "0px 5px" }} />
						Login
                    </Link>
				</li>);
		}
	}
}
const mapStoreToProps = (store) => {
	return ({
		links: store.links
	});
}
export default connect(mapStoreToProps)(NavBar);