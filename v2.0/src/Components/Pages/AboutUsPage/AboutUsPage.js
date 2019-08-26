import React from 'react'
import URLS from '../../../api/urls';
import { getJson, section } from '../../../api/functions'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import Video from './Video'
import TeamMembers from './TeamMembers'
import DonateBar from './DonateBar'
import { connect } from 'react-redux'
import {reduxLoadCommunityAdmins} from '../../../redux/actions/pageActions'

// Carousel from npm react-multi-carousel
import 'react-multi-carousel/lib/styles.css';

class AboutUsPage extends React.Component {
    render() {
        if (!this.props.community) {
            return <LoadingCircle />;
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
        const videoLink = video.image? video.image.url : null;
        const paragraphContent = section(this.props.pageData.sections, "AboutUsDescription", true).description;
        const donateMessage = section(this.props.pageData.sections, "DonateBar", true).description;

        const teamMembersData = this.props.communityAdmins

        return (
            <div className="boxed_wrapper">

                <WelcomeImages
                    data={welcomeImagesData} title="About Us"
                />
                <div className="row m-0 mt-3">
                    <div className= {videoLink? "col-sm-12 col-md-6": "d-none"}>
                        <Video link={videoLink} />
                    </div>
                    <div className={videoLink? "col-sm-12 col-md-6": "col-12"} dangerouslySetInnerHTML={{ __html: paragraphContent }}>
                    </div>
                </div>
                <TeamMembers data={teamMembersData} />
                <DonateBar donateMessage={donateMessage} />

            </div>
        );
    }
}

const mapStoreToProps = (store) => {

    return {
        community: store.page.community,
        communityAdmins: store.page.communityAdmins
    }
}

export default connect(mapStoreToProps, {reduxLoadCommunityAdmins})(AboutUsPage);