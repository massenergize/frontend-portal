import React from 'react';
import logo from '../logo.svg';
import '../assets/css/style.css';

/**
 * Renders the Navigation bar 
 * @props
 *      navLinks
 *          link
 *          name
 */
class NavBar extends React.Component{
    renderNavLinks(navLinks){
        if(!navLinks){
            return <li>No PageLinks to Display</li>
        }
        return Object.keys(navLinks).map(key=> {
            var navLink = navLinks[key];
            return <li key = {navLink.name}><a href = {navLink.link}>{navLink.name}</a></li>
        });
    }
    render(){
        return(
            <section className="theme_menu stricky">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="main-logo">
                                <a href="index.html"><img src={logo} alt=""/></a>
                            </div>
                        </div>
                        <div className="col-md-9 menu-column">
                            <nav className="menuzord" id="main_menu">
                                <ul className="menuzord-menu menuzord-indented scrollable">
                                    {this.renderNavLinks(this.props.navLinks)}   
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
export default NavBar;