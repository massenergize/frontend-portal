import React from 'react';
import logo from '../../logo.svg';

/** Renders the address/ company contact info in the footer
 * @props :
    info
        text
        address
        city
        state
        zipcode
        phone
        email
*/

class FooterInfo extends React.Component{
    render(){
        return(
            <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="footer-widget about-column">
                    <figure className="footer-logo"><a href="index.html"><img src={logo} alt=""/></a></figure>
                    <div className="text"><p>{this.props.info.text}</p></div>
                    <ul className="contact-info">
                        <li><span className="icon-signs"></span> {this.props.info.address}, {this.props.info.city} <br/>{this.props.info.state} {this.props.info.zipcode}, USA</li>
                        <li><span className="icon-phone-call"></span> Phone: {this.props.info.phone}</li>
                        <li><span className="icon-note"></span>{this.props.info.email}</li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default FooterInfo