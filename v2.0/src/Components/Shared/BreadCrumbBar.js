import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
class BreadCrumbBar extends React.Component {
	render() {
		return (
			<div className="breadcumb-wrapper" style={{marginTop:90,marginBottom:31,background:'rgb(245, 255, 222)'}}>
				<div className="container">
					<div className="pull-left">
						<ul className="list-inline link-list">
							<li>
								<Link to={this.props.reduxLinks.home} className='link'> Home </Link>
							</li>
							{Object.keys(this.props.links).map(key => {
								const link = this.props.links[key];
								if (link.link) {
									return (
										<li key={key}>
											<Link to={`${link.link}`} className='link'>{link.name}</Link>
										</li>
									);
								} else if (link.name) {
									return (
										<li key={key} style={{color:'#333'}}>
											{link.name}
										</li>
									);
								}
							})}
						</ul>
					</div>

				</div>
			</div>
		);
	}
}
const mapStoreToProps = (store) => {
	return ({
		reduxLinks: store.links
	});
}
export default connect(mapStoreToProps)(BreadCrumbBar);
