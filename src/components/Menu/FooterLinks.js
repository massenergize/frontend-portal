import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { isValidUrl } from "../../api/urls";


/** Renders the Navigation links in the footer
@props
    title
    links
        text
        link
*/
class FooterLinks extends React.Component { 
	renderLinks(links) {
		if (!links) {
			return <div>No Links to Display</div>
		}
		return Object.keys(links).map(key => {
			var link = links[key];
			return (
				<li key={link.name}>
        		  {isValidUrl(link.link) ? (
          			<a
            			href={`${link.link}`}
            			style={{ width: "100%", height: "100%" }}
            			target={"_blank"}
            			rel="noopener noreferrer"
          			>
						  {link.name}
		          </a>
        		) : (
					<Link className="cool-font" to={`${link.link}`}>{link.name}</Link>
				)}
				</li>
			);
		});
	}
	render() {
		const links = this.props.links;
		console.log(links)
		const twoCol = links.length > 4;
		if (twoCol) {
			var half_length = Math.ceil(links.length / 2);
			var leftSide = links.slice(0, half_length);
			var rightSide = links.slice(half_length, links.length);
			return (
				  <div className="col-5 col-md-4">
					<div className="footer-widget link-column">
						<div className="section-title d-none d-md-block">
							<b className="text-white">{this.props.title}</b>
						</div>
						<div className="row">
							<div className="col-12 col-md-6">
								<div className="widget-content">
									<ul className="list mb-0 cool-font">
										{this.renderLinks(leftSide)}
									</ul>
								</div>
							</div>
							<div className="col-12 col-md-6">
								<div className="widget-content">
									<ul className="list mb-0">
										{this.renderLinks(rightSide)}
									</ul>
								</div>
							</div>
						</div>
					</div>
				  </div>
			);	
		} else {
			return (
				<div>
				  <div className="footer-widget link-column">
					  <div className="section-title d-none d-md-block">
						  <b className="text-white">{this.props.title}</b>
					  </div>
					  <div className="row">
						  <div>
							  <div className="widget-content">
								  <ul className="list mb-0 cool-font">
									  {this.renderLinks(links)}
								  </ul>
							  </div>
						  </div>
					  </div>
				  </div>
				</div>
			);
		}
	}
}
const mapStoreToProps = (store) => {
	return {
		pageData: store.page.homePage,
		reduxLinks: store.links
	}
}
export default connect(mapStoreToProps, null)(FooterLinks);