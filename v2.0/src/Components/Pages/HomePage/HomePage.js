import React from 'react'
import CONST from '../../Constants';
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import Graphs from './Graphs';
import IconBoxTable from './IconBoxTable';
import Events from './Events';
import URLS, { getJson } from '../../api_v2'


/*
* The Home Page of the MassEnergize
*/
class HomePage extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
			loaded: false
		}
	}
	componentDidMount() {
		Promise.all([
			getJson(URLS.EVENTS + "?community=1"),
		]).then(myJsons => {
			this.setState({
				events: myJsons[0].data[0].content,
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
            iconBoxesData,
        } = this.state.pageData;

        const {impactData} = this.state.impactData;
        const {events} = this.state.eventsData;

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
                    boxes={iconBoxesData}
                />
                <Events
                    events={events}
                />
                
            </div>
        );
    }
}
export default HomePage;