import React from 'react'
import FooterInfo from './FooterInfo'
import FooterLinks from './FooterLinks'
import {Link} from 'react-router-dom'
/**
 * Footer section has place for links, 
 */
class Footer extends React.Component{
    render(){
        return (
            <div className="d-flex flex-column">
                <footer className="main-footer">
                    {/* <!--Widgets Section--> */}
                    <div className="widgets-section">
                        <div className="container">
                            {/* <!--Big Column--> */}
                            <div className="big-column">
                                <div className="row clearfix">
                                    {/* <!--Footer Column--> */}
                                    <FooterInfo
                                        info={this.props.data? this.props.data.footerInfo : {}}
                                    />
                                    {/* <!--Footer Column--> */}
                                    <FooterLinks
                                        title={this.props.data.footerLinks.title}
                                        links={this.props.data.footerLinks.links}
                                    />
                                    {/* <!--Footer Column--> */}
                                    <div className="col-12 col-md-4">
                                        <div className="footer-widget contact-column text-center text-md-left">
                                            <div className="section-title">
                                                <b className="text-white">Subscribe to Newsletter</b>
                                            </div>
                                            <form action="/">
                                                <input type="email" placeholder="Email address...."/>
                                                <button type="submit"><i className="fa fa-paper-plane"></i></button>
                                            </form>
                                            <p>We don’t do mail to spam and your mail id is confidential.</p>

                                            <ul className="social-icon">
                                                <li><a href="/"><i className="fa fa-facebook"></i></a></li>
                                                <li><a href="/"><i className="fa fa-twitter"></i></a></li>
                                                <li><a href="/"><i className="fa fa-google-plus"></i></a></li>
                                                <li><a href="/"><i className="fa fa-linkedin"></i></a></li>
                                                <li><a href="/"><i className="fa fa-feed"></i></a></li>
                                                <li><a href="/"><i className="fa fa-skype"></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
                <section className="footer-bottom">
                    <div className="container">
                        <div className="pull-left copy-text">
                            <p><a href="https://massenergize.org">Copyrights © 2019</a> All Rights Reserved. Powered by <a href="https://massenergize.org">MassEnergize</a></p>

                        </div>
                        <div className="pull-right get-text">
                            <Link to="/donate">Donate Now</Link>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
export default Footer;