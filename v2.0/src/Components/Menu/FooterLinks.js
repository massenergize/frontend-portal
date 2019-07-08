import React from 'react'
import {Link} from 'react-router-dom'


/** Renders the Navigation links in the footer
@props
    title
    links
        text
        link
*/
class FooterLinks extends React.Component{
    renderLinks(links){
        if(!links){
            return <div>No Links to Display</div>
        }
        return Object.keys(links).map(key=> {
            var link = links[key];
            return (
                <li>
                    <Link to={link.link}>{link.name}</Link>
                </li>
            );
        });
    }
    render(){
        return(
            <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="footer-widget link-column">
                    <div className="section-title">
                        <h4>{this.props.title}</h4>
                    </div>
                    <div className="widget-content">
                        <ul className="list">
                            {this.renderLinks(this.props.links)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
export default FooterLinks