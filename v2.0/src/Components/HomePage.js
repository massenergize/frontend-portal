import React from 'react'
import CONST from './Constants.js';
import LoadingPage from './LoadingPage.js';
<<<<<<< Updated upstream
import NavBar from './NavBar.js';
=======
import NavBarBurger from './NavBarBurger';
>>>>>>> Stashed changes
import WelcomeImages from './WelcomeImages.js'
import Graphs from './Graphs';
import IconBoxTable from './IconBoxTable.js';
import Events from './Events';
import Footer from './Footer';

/*
* The Home Page of the MassEnergize
*/
class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageData: null,
            menuData: null,
            userData: null,
        }
    }
    componentDidMount() {
        fetch(CONST.URL.USER).then(data => {
            console.log(data);
            return data.json()
        }).then(myJson => {
            console.log(myJson);
            this.setState({
                pageData: myJson.pageData,
                menuData: myJson.menuData,
                userData: myJson.userData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
        
    }
    render() {
        if (!this.state.pageData) return <LoadingPage/>;
        const {
            navLinks,
            footerData,
        } = this.state.menuData;
        const {
            welcomeImagesData,
            graphsData,
            iconBoxesData,
            eventsData
        } = this.state.pageData;
        return (
            <div className="boxed_wrapper">
                <NavBarBurger
                    navLinks={navLinks}
                    userData={this.state.userData}
                />
                <WelcomeImages
                    data={welcomeImagesData} title="MassEnergize"
                />
                <Graphs
                    graphs={graphsData}
                />
                <IconBoxTable
                    title=""
                    boxes={iconBoxesData}
                />
                <Events
                    events={eventsData}
                />
                <Footer
                    data={footerData}
                />
            </div>
        );
    }
}
export default HomePage;