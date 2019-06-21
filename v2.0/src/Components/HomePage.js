import React from 'react'
import NavBar from './NavBar.js';
import WelcomeImages from './WelcomeImages.js'
import Graphs from './Graphs';
import IconBoxTable from './IconBoxTable.js';
import Events from './Events';
import Footer from './Footer';

var apiurl = 'http://localhost:8000/user/'

class HomePage extends React.Component {
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
        if (!this.state.pageData) return <div></div>;
        const {
            navLinks,
            footerData
        } = this.state.menuData;
        const {
            welcomeImagesData,
            graphsData,
            iconBoxesData,
            eventsData
        } = this.state.pageData;
        return (
            <div className="boxed_wrapper">
                <NavBar
                    navLinks={navLinks}
                />
                <WelcomeImages
                    data={welcomeImagesData}
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