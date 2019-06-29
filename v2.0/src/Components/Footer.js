import React from 'react'
import FooterInfo from './FooterInfo.js'
import FooterEvents from './FooterEvents.js'
import FooterLinks from './FooterLinks.js'
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
                            <div className="row">
                                {/* <!--Big Column--> */}
                                <div className="big-column col-lg-6 col-md-12">
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
                                    </div>
                                </div>
                                {/* <!--Big Column--> */}
                                <div className="big-column col-lg-6 col-md-12">
                                    <div className="row clearfix">
                                        {/* <!--Footer Column--> */}
                                        <FooterEvents
                                            events={this.props.data.events}
                                        />
                                        {/* <!--Footer Column--> */}
                                        <div className="col-md-6 col-sm-12">
                                            <div className="footer-widget contact-column">
                                                <div className="section-title">
                                                    <h4>Subscribe Us</h4>
                                                </div>
                                                <h5>Subscribe to our newsletter!</h5>
                                                <form action="/">
                                                    <input type="email" placeholder="Email address...."/>
                                                    <button type="submit"><i className="fa fa-paper-plane"></i></button>
                                                </form>
                                                <p>We don’t do mail to spam and your mail <br/>id is confidential.</p>

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
                    </div>
                </footer>
                <section className="footer-bottom">
                    <div className="container">
                        <div className="pull-left copy-text">
                            <p><a href="https://massenergize.org">Copyrights © 2019</a> All Rights Reserved. Powered by <a href="https://massenergize.org">MassEnergize</a></p>

                        </div>
                        <div className="pull-right get-text">
                            <a href="/">Join Us Now!</a>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
export default Footer;