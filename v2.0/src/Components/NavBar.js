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
                        {this.renderLogin()} 
                        <div className="col-md-2">
                            <div className="main-logo">
                                <a href="index.html"><img src={logo} alt=""/></a>
                            </div>
                        </div>
                        <div className="col-md-10 menu-column">
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
    renderLogin(){
        const { 
            loggedIn, 
            name
         } = this.props.userData
        if(loggedIn){
           
        }else{
            return <a className="thm-btn float_right" href="/login"><i className="fa fa-user"/> Login</a>;
        }
    }
}
export default NavBar;