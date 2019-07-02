import React from 'react'
import CONST from './Constants.js';
import LoadingPage from './LoadingPage.js';
import NavBarBurger from './NavBarBurger';
import NavBarOffset from './NavBarOffset';
import WelcomeImages from './WelcomeImages.js'
import Video from './Video.js'
import TeamMembers from './TeamMembers.js'
import DonateBar from './DonateBar.js'
import Footer from './Footer';

// Carousel from npm react-multi-carousel
import 'react-multi-carousel/lib/styles.css';

class AboutUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
            menuData: null,
            userData: null,
            aboutUsData: null,
        }
    }
    componentDidMount() {
        fetch(CONST.URL.ABOUTUS).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                menuData: myJson.menuData,
                userData: myJson.userData,
                aboutUsData: myJson.aboutUsData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        if(!this.state.menuData) return <LoadingPage/>;
        const {
            navLinks,
            navBarSticky,
            footerData
        } = this.state.menuData;

        const {
            welcomeImagesData,
            videoLink,
            paragraphContent,
            teamMembersData,
            donateMessage,
        } = this.state.aboutUsData;

        console.log(teamMembersData);

        return (
            <div className="boxed_wrapper">
                <NavBarBurger
                    navLinks={navLinks}
                    userData={this.state.userData}
                    sticky={navBarSticky}
                />
                <NavBarOffset sticky={navBarSticky}/>
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
                <Footer
                    data={footerData}
                />
            </div>
        );
    }
}
export default AboutUs;