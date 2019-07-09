import React from 'react';
import logo from '../../logo.svg';
import {Link} from 'react-router-dom'


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
            <div className="col-7 col-md-4">
                <div className="footer-widget about-column">
                    <figure><Link to="/"><img src={logo} alt="" className="col-10 p-0"/></Link></figure>
                    <ul className="contact-info">
                        <li><span className="icon-e-mail-envelope"></span> {this.props.info.email}</li>
                        <li><span className="icon-phone-call"></span>{this.props.info.phone}</li>
                        <li><span className="icon-people3"></span><Link to={this.props.info.contactPersonLink} target="_blank" className="font-normal"><u>{this.props.info.contactPerson}</u></Link></li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default FooterInfo