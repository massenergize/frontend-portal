import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import Graphs from './Graphs';
import IconBoxTable from './IconBoxTable';
import Events from './Events';
import URLS, { getJson } from '../../api_v2';


/*
* The Home Page of the MassEnergize
*/
class HomePage extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            welcomeImagesData: null,
            impactData: null,
            iconQuickLinks: null,
            events: null,
			loaded: false
		}
	}
	componentDidMount() {
		Promise.all([
            getJson(URLS.PAGES + "?name=Home"),
            getJson(URLS.EVENTS),
		]).then(myJsons => {
			this.setState({
                welcomeImagesData: myJsons[0].data[0].sections[0].slider[0].slides,
                impactData: myJsons[0].data[0].sections[1].graphs,
                iconQuickLinks: myJsons[0].data[0].sections[2].cards,
                events: myJsons[1].data,
				loaded: true
			})
		}).catch(err => {
			console.log(err)
		});
	}
	render() {
		if (!this.state.loaded) return <LoadingCircle />;
        const {
            welcomeImagesData,
            impactData,
            iconQuickLinks,
            events
        } = this.state;

        return (
            <div className="boxed_wrapper">
                
                <WelcomeImages
                    data={welcomeImagesData} title="MassEnergize"
                />
                <Graphs
                    graphs={impactData}
                    size={120}
                />
                <IconBoxTable
                    title=""
                    boxes={iconQuickLinks}
                />
                <Events
                    events={events}
                />
                
            </div>
        );
    }
}
export default HomePage;