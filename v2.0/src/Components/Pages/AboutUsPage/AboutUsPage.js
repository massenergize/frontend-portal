import React from 'react'
import URLS from '../../../api/urls';
import { getJson, section } from '../../../api/functions'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import Video from './Video'
import TeamMembers from './TeamMembers'
import DonateBar from './DonateBar'
import { connect } from 'react-redux'

// Carousel from npm react-multi-carousel
import 'react-multi-carousel/lib/styles.css';

class AboutUsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teamMembersData: null,
            loaded: false,
        }
    }
    componentDidMount() {
        Promise.all([
            getJson(URLS.COMMUNITY_ADMIN_GROUP)
        ]).then(myJsons => {
            this.setState({
                teamMembersData: myJsons[0].data.members,
                loaded: true
            })
        }).catch(err => {
            console.log(err)
        });
    }

    render() {
        if (!this.state.loaded || !this.props.pageData) return <LoadingCircle />;

        const welcomeImagesData = section(this.props.pageData.sections, "WelcomeImages", true).slider[0].slides;
        const videoLink = section(this.props.pageData.sections, "AboutUsVideo", true).image.url;
        const paragraphContent = section(this.props.pageData.sections, "AboutUsDescription", true).description;
        const donateMessage = section(this.props.pageData.sections, "DonateBar", true).description;

        const {
            teamMembersData
        } = this.state

        return (
            <div className="boxed_wrapper">

                <WelcomeImages
                    data={welcomeImagesData} title="About Us"
                />
                <div className="row m-0 mt-3">
                    <div className="col-sm-12 col-md-6">
                        <Video link={videoLink} />
                    </div>
                    <div className="col-sm-12 col-md-6" dangerouslySetInnerHTML={{ __html: paragraphContent }}>
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
        pageData: store.page.aboutUsPage
    }
}

export default connect(mapStoreToProps, null)(AboutUsPage);