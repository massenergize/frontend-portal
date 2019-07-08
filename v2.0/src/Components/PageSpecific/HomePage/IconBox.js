import React from 'react'
import {Link} from 'react-router-dom'

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
                    <Link to={this.props.link}><button className="button" >More</button></Link>
                </div>
        );
    }
}
export default IconBox;