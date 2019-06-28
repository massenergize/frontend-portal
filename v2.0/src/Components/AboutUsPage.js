import React from 'react'
import NavBar from './NavBar.js';
import WelcomeImages from './WelcomeImages.js'
import Video from './Video.js'
import TeamMembers from './TeamMembers.js'
import DonateBar from './DonateBar.js'
import Footer from './Footer';

var apiurl = 'http://api.massenergize.org/user/'
// var apiurl = 'http://localhost:8000/user/'


class AboutUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
            menuData: null
        }
    }
    componentDidMount() {
        fetch(apiurl).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                pageData: myJson.pageData,
                menuData: myJson.menuData
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        if(!this.state.menuData) return <div>Waiting for server...</div>
        const {
            navLinks,
            footerData
        } = this.state.menuData;

        return (
            <div className="boxed_wrapper">
                <NavBar
                    navLinks=""
                />
                <WelcomeImages
                    data="" title="About Us"
                />
                <div class="col-sm-12 col-md-6">
                    <Video link="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"/>
                </div>
                <div class="col-sm-12 col-md-6">
                    <p>This is a paragraph woohoo</p>
                </div>
                <TeamMembers data="" />
                <DonateBar />
                <Footer
                    data={footerData}
                />
            </div>
        );
    }
}
export default AboutUs;