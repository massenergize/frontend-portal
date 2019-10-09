import React from 'react'
import URLS from '../../../api/urls';
import { getJson, section } from '../../../api/functions'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import Video from './Video'
import TeamMembers from './TeamMembers'
import DonateBar from './DonateBar'
import { connect } from 'react-redux'
import { reduxLoadCommunityAdmins } from '../../../redux/actions/pageActions'

// Carousel from npm react-multi-carousel
import 'react-multi-carousel/lib/styles.css';

class AboutUsPage extends React.Component {
	render() {
		if (!this.props.pageData || !this.props.community) {
			return <p className='text-center'> Sorry, looks like this community's About Us Page is under maintenance. Try again later </p>
		}

		if (!this.props.communityAdmins) {
			getJson(URLS.COMMUNITY_ADMIN_GROUP + this.props.community.id).then(json => {
				if (json.success && json.data) {
					this.props.reduxLoadCommunityAdmins(json.data.members)
				}
			});
			return <LoadingCircle />
		}

		const welcomeImagesData = section(this.props.pageData.sections, "WelcomeImages", true).slider[0].slides;
		const video = section(this.props.pageData.sections, "AboutUsVideo", true);
		const videoLink = video.image ? video.image.url : null;
		const paragraphContent = section(this.props.pageData.sections, "AboutUsDescription", true).description;
		const donateMessage = section(this.props.pageData.sections, "DonateBar", true).description;

		const teamMembersData = this.props.communityAdmins

		return (
			<>

				<div className="boxed_wrapper">
					<BreadCrumbBar links={[{ name: 'About Us' }]} />

					{/* <WelcomeImages
						data={welcomeImagesData} title="About Us"
					/> */}
					<div className="col-md-10 col-lg-10 offset-md-1 col-sm-10 col-xs-12">
						<div style={{ marginTop: 70 }}></div>
						<div className={videoLink ? "col-sm-12 col-md-10 offset-md-1" : "d-none"}>
							<center><h2 className="cool-font" style={{ padding: 20 }}>About Our Community</h2></center>
							<Video link={videoLink} />
							<div className="community-about-text cool-font" dangerouslySetInnerHTML={{ __html: paragraphContent }}></div>
						</div>
						<div className=" col-sm-12 col-md-10 offset-md-1 mass-energize-about">
							<center><h2 className="cool-font" style={{ padding: 20 }}>About MassEnergize</h2></center>
							<p className="cool-font">We believe that local leaders can engage their communities, but need better tools like fully customizable web platforms and strategies for outreach, networking and empowerment. Most groups just don’t have the bandwidth. But we do.</p>
						</div>
					</div>
					{/* <div className="row m-0 mt-3">
						<div className={videoLink ? "col-sm-12 col-md-6" : "col-12"} dangerouslySetInnerHTML={{ __html: paragraphContent }}>
						</div>
					</div> */}
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
		pageData: store.page.aboutUsPage
	}
}

export default connect(mapStoreToProps, { reduxLoadCommunityAdmins })(AboutUsPage);