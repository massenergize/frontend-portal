import React from 'react'
import FooterInfo from './FooterInfo'
import FooterLinks from './FooterLinks'
import { Link } from 'react-router-dom'
import SubscribeForm from './SubscribeForm';
/**
 * Footer section has place for links, 
 */
class Footer extends React.Component {
    render() {
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
                                        info={this.props.footerInfo ? this.props.footerInfo : {}}
                                    />
                                    {/* <!--Footer Column--> */}
                                    <FooterLinks
                                        title="Quick Links"
                                        links={this.props.footerLinks}
                                    />
                                    {/* <!--Footer Column--> */}
                                    <div className="col-12 col-md-4">
                                        <SubscribeForm/>
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