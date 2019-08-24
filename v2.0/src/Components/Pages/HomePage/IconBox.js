import React from 'react'
import { Link } from 'react-router-dom'

/**
 * renders a single icon box on the home page
 * @props
 *      icon (fa fa-something)
 *      title
 *      description
 *      link
 */
class IconBox extends React.Component {
    render() {
        return (
                <div className="service-item center">
            <Link to={this.props.link} style={{width:'100%', height:'100%'}}>

                    <div className="icon-box text-center">
                        <span className={this.props.icon}></span>
                    </div>
                    <h4>{this.props.title}</h4>
                    <p>{this.props.description}</p>
                    </Link>

                </div>

        );
    }
}
export default IconBox;