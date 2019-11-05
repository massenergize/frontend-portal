import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

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
			<div className="service-item center hover-service-item" style={{background:'white'}}>
				<Link to={`${this.props.links.home}${this.props.link}`} style={{ width: '100%', height: '100%' }}>

					<div className="icon-box text-center" >
						<span className={this.props.icon}></span>
					</div>
					<h4 className="cool-font">{this.props.title}</h4>
					<p className="cool-font">{this.props.description}</p>
				</Link>

			</div>

		);
	}
}
const mapStoreToProps = (store) => {
	return ({
		links: store.links
	});
}
export default connect(mapStoreToProps)(IconBox);