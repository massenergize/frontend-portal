import React from 'react'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import Video from './Video'
import DonateBar from './DonateBar'
import { connect } from 'react-redux'
import { reduxLoadCommunityAdmins } from '../../../redux/actions/pageActions'

// Carousel from npm react-multi-carousel
import './node_modules/react-multi-carousel/lib/styles.css';

class ContactUsPage extends React.Component {
	render() {
	
		if (!this.props.pageData || !this.props.community) {
			return <p className='text-center'> Sorry, looks like this community's About Us Page is under maintenance. Try again later </p>
		}


		const pageData = this.props.pageData;
	//	const welcomeImagesData = section(this.props.pageData.sections, "WelcomeImages", true).slider[0].slides;
		//const video = section(this.props.pageData.sections, "AboutUsVideo", true);
		const videoLink = pageData ? pageData.featured_video_link : null;
		const paragraphContent = pageData.description;
		const donateMessage = "Help support our cause by donating";

		return (
			<>
				<div className="boxed_wrapper">
					<BreadCrumbBar links={[{ name: 'About Us' }]} />
					{/* <WelcomeImages
						data={welcomeImagesData} title="About Us"
					/> */}
					<div className="col-md-10 col-lg-10 offset-md-1 col-sm-10 col-xs-12">
						<div style={{ marginTop: 70 }}></div>
						{videoLink ?
							<div className={videoLink ? "col-sm-12 col-md-10 offset-md-1" : "d-none"}>
								<Video link={videoLink} />
							</div>
							: null
						}
						<div className={paragraphContent ? "col-sm-12 col-md-10 offset-md-1" : "d-none"}>
							<center><h2 className="cool-font" style={{ padding: 20 }}>About Our Community</h2></center>
							<div className="community-about-text cool-font" style={{color:'gray'}} dangerouslySetInnerHTML={{ __html: paragraphContent }}></div>
						</div>
						<div className=" col-sm-12 col-md-10 offset-md-1 mass-energize-about">
							<center><h2 className="cool-font" style={{ padding: 20 }}>About MassEnergize</h2></center>
							<p className="cool-font" style={{color:'gray'}}>
								Our mission is to provide communities with the tools and resources to motivate and support their residents, businesses and non-profits in a wide array of actions to reduce greenhouse gas emissions and prepare for a changing climate. We leverage the collective expertise, experience and buying power of multiple towns, cities and local organizations by collaborating with them on tools, strategies, and resources. This community web platform is one example of our work. For more information go to <a href="www.massenergize.org">www.massenergize.org</a>.

							</p>
						</div>
					</div>
				
					{/* <TeamMembers data={teamMembersData} /> */}
					<DonateBar donateMessage={donateMessage} />
				</div>
			</>
		);
	}
}

const mapStoreToProps = (store) => {

	return {
		community: store.page.community,
		communityAdmins: store.page.communityAdmins,
		pageData: store.page.ContactUsPage
	}
}

export default connect(mapStoreToProps, { reduxLoadCommunityAdmins })(ContactUsPage);