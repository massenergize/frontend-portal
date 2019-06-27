import React from 'react'
import '../assets/css/style.css';

/**
 * renders a single icon box on the home page
 * @props
 *      icon (fa fa-something)
 *      title
 *      description
 *      link
 */
class IconBox extends React.Component{
    render(){
        return(
                <div className="service-item center">
                    <div className="icon-box">
                        <span className={this.props.icon}></span>
                    </div>
                    <h4>{this.props.title}</h4>
                    <p>{this.props.description}</p>
                    <a href={this.props.link}><button className="button" >More</button></a>
                </div>
        );
    }
}
export default IconBox;