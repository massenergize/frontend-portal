import React from 'react';
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
//import Video from './Video'
import ReactPlayer from "react-player"
import ErrorPage from "../Errors/ErrorPage"
import DonateBar from './DonateBar'
import { connect } from 'react-redux'
import { reduxLoadCommunityAdmins } from '../../../redux/actions/pageActions'
// Carousel from npm react-multi-carousel
import 'react-multi-carousel/lib/styles.css';
import LoadingCircle from '../../Shared/LoadingCircle'

class AboutUsPage extends React.Component {
	render() {
		if (!this.props.pageData || !this.props.community) {
			return <LoadingCircle />
		
		}
		else if(this.props.pageData ==={} || this.props.community ==={}){
      		return <ErrorPage
        		errorMessage="Data unavailable"
        		errorDescription="Unable to load About Us data"
      		/>;
		}

		const pageData = this.props.pageData;
		const donatePageData = this.props.donatePageData;
		const title = pageData.title ? pageData.title : "About Our Community";
		const subtitle = pageData.sub_title ? pageData.sub_title : null;
		const videoLink = pageData.featured_video_link ? pageData.featured_video_link : null;
		const image = pageData.image ? pageData.image : null;
		const paragraphContent = pageData.description;
		const donateMessage = donatePageData && donatePageData.title ? donatePageData.title : null;
		return (
			<div className="boxed_wrapper">
				<BreadCrumbBar links={[{ name: 'About Us' }]} />
				<div className="col-md-10 col-lg-10 offset-md-1 col-sm-10 col-xs-12">
					<div style={{ marginTop: 70 }}></div>
					<div className={paragraphContent ? "col-sm-12 col-md-10 offset-md-1" : "d-none"}>
						<center><h2 className="cool-font" style={{ padding: 10 }}>{title}</h2></center>
						{subtitle ?
							<div>
								<center><em><h4 className="cool-font" style={{ padding: 10 }}>{subtitle}</h4></em></center>
							</div>
						: null }

						<div className="community-about-text cool-font make-me-dark" style={{fontSize:'large', textAlign:'justify'}} dangerouslySetInnerHTML={{ __html: paragraphContent }}></div>
					</div>

					{videoLink ?
						<div className={videoLink ? "col-sm-12 col-md-10 offset-md-1" : "d-none"}>
							<center>
							{/* <Video link={videoLink} /> */}
							<ReactPlayer url={videoLink} />
							</center>
						</div>
						: null
					}

					{image ?				  
						<div className={image ? "col-sm-12 col-md-10 offset-md-1" : "d-none"}>

							<center>
								<img
								  	src={image ? image.url : null}
								  	alt="About Us"
      								style={{ objectFit: "container", maxHeight: 400 }}
    							/>
							</center>
						</div>
						: null
					}   

					<div className=" col-sm-12 col-md-10 offset-md-1 mass-energize-about">
						<center><h2 className="cool-font" style={{ padding: 10 }}>About MassEnergize</h2></center>
						<p className="cool-font make-me-dark" style={{textAlign:"justify"}}>
							Our mission is to provide communities with the tools and resources to motivate and support their residents, businesses and non-profits in a wide array of actions to reduce greenhouse gas emissions and prepare for a changing climate. We leverage the collective expertise, experience and buying power of multiple towns, cities and local organizations by collaborating with them on tools, strategies, and resources. This community web platform is one example of our work. For more information go to <a href="https://www.massenergize.org" target="_blank" rel="noopener noreferrer">www.massenergize.org</a>.

						</p>
					</div>
				</div>
			
				{donateMessage ?
					<div>
						<DonateBar donateMessage={donateMessage} />
					</div>
				: null }
			</div>
		);
	}
}

const mapStoreToProps = (store) => {

	return {
		community: store.page.community,
		communityAdmins: store.page.communityAdmins,
		pageData: store.page.aboutUsPage,		
		donatePageData: store.page.donatePage,
    	homePageData: store.page.homePageData,
    	links: store.links,
	}
}

export default connect(mapStoreToProps, { reduxLoadCommunityAdmins })(AboutUsPage);