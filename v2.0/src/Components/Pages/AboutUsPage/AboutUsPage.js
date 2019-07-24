import React from 'react'
import URLS, {getJson, section} from '../../api_v2';
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import Video from './Video'
import TeamMembers from './TeamMembers'
import DonateBar from './DonateBar'

// Carousel from npm react-multi-carousel
import 'react-multi-carousel/lib/styles.css';

class AboutUsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
            userData: null,
        }
    }
    componentDidMount() {
        Promise.all([
            getJson(URLS.PAGES + "?name=AboutUs"),
            getJson(URLS.COMMUNITY_ADMIN_GROUP)
		]).then(myJsons => {
			this.setState({
                welcomeImagesData: section(myJsons[0], "WelcomeImages").slider[0].slides,
                videoLink: section(myJsons[0], "AboutUsVideo").image.url,
                paragraphContent: section(myJsons[0], "AboutUsDescription").description,
                teamMembersData: myJsons[1].data.members,
                donateMessage: section(myJsons[0], "DonateBar").description,
				loaded: true
			})
		}).catch(err => {
			console.log(err)
        });
    }

    render() {
        if(!this.state.loaded) return <LoadingCircle/>;
        const {
            welcomeImagesData,
            videoLink,
            paragraphContent,
            teamMembersData,
            donateMessage,
        } = this.state;

        return (
            <div className="boxed_wrapper">
                
                <WelcomeImages
                    data={welcomeImagesData} title="About Us"
                />
                <div className="row m-0 mt-3">
                    <div className="col-sm-12 col-md-6">
                        <Video link={videoLink}/>
                    </div>
                    <div className="col-sm-12 col-md-6" dangerouslySetInnerHTML={{__html: paragraphContent}}>
                    </div>
                </div>
                <TeamMembers data={teamMembersData} />
                <DonateBar message={donateMessage}/>
                
            </div>
        );
    }
}
export default AboutUsPage;