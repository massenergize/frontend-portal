import React from 'react';
import logo from '../logo.svg';
import '../assets/css/style.css';

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
    constructor(props){
        super(props);
        this.state={
            burger: false,
            collapsed: true
        }
    }
    renderNavLinks(navLinks) {
        if (!navLinks) {
            return <li>No PageLinks to Display</li>
        }
        return Object.keys(navLinks).map(key => {
            var navLink = navLinks[key];
            return <li key={navLink.name}><a href={navLink.link}>{navLink.name}</a></li>
        });
    }
    render() {
        return (
            <nav className="theme_menu navbar stricky">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-12">
                            <div className="main-logo">
                                <a href="index.html"><img src={logo} alt="" /></a>
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
        );
    }
    renderLogin() {
        const {
            loggedIn,
            name
        } = this.props.userData
        if (loggedIn) {
            return (
                <li>
                    <a  style={{color: "#8ec449"}}>
                        <i className="fa fa-user" />
                        Welcome: <br/>
                        {name}
                    </a>
                </li>
            );
        } else {
            return (
                <li >
                    <a className="thm-btn float-right" href="/login">
                        <i className="fa fa-user" style={{ padding: "0px 5px" }} />
                        Login
                    </a>
                </li>);
        }
    }
}
export default NavBar;