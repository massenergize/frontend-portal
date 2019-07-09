import React from 'react'
import CONST from '../../Constants.js';
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
        fetch(CONST.URL.ABOUTUS).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                userData: myJson.userData,
                pageData: myJson.pageData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        if(!this.state.pageData) return <LoadingCircle/>;
        const {
            welcomeImagesData,
            videoLink,
            paragraphContent,
            teamMembersData,
            donateMessage,
        } = this.state.pageData;

        console.log(teamMembersData);

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