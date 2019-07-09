import React from 'react'
import CONST from '../../Constants';
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import Graphs from './Graphs';
import IconBoxTable from './IconBoxTable';
import Events from './Events';

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
        if (!this.state.pageData) return <LoadingCircle/>;
        const {
            welcomeImagesData,
            iconBoxesData,
        } = this.state.pageData;

        const {impactData} = this.state.impactData;
        const {eventsData} = this.state.eventsData;

        return (
            <div className="boxed_wrapper">
                
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
                
            </div>
        );
    }
}
export default HomePage;