import React from 'react'
import CONST from '../Constants';
import LoadingPage from './LoadingPage';
import NavBarBurger from '../Menu/NavBarBurger';
import NavBarOffset from '../Menu/NavBarOffset';
import WelcomeImages from '../PageSpecific/HomePage/WelcomeImages'
import Graphs from '../PageSpecific/HomePage/Graphs';
import IconBoxTable from '../PageSpecific/HomePage/IconBoxTable';
import Events from '../PageSpecific/HomePage/Events';
import Footer from '../Menu/Footer';

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
            eventsData: null,
            impactData: null
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
                eventsData: myJson.eventsData,
                impactData: myJson.impactData,
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
            navBarSticky,
            footerData,
        } = this.state.menuData;
        const {
            welcomeImagesData,
            iconBoxesData,
        } = this.state.pageData;

        const {impactData} = this.state.impactData;
        const {eventsData} = this.state.eventsData;

        return (
            <div className="boxed_wrapper">
                <NavBarBurger
                    navLinks={navLinks}
                    userData={this.state.userData}
                    sticky={navBarSticky}
                />
                <NavBarOffset sticky={navBarSticky}/>
                <WelcomeImages
                    data={welcomeImagesData} title="MassEnergize"
                />
                <Graphs
                    graphs={impactData}
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