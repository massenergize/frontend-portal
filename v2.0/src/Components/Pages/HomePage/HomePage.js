import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import Graphs from './Graphs';
import IconBoxTable from './IconBoxTable';
import Events from './Events';
import URLS, {getJson, section} from '../../api_v2';


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
                welcomeImagesData: section(myJsons[0], "WelcomeImages").slider[0].slides,
                impactData: section(myJsons[0], "Graph Section").graphs,
                iconQuickLinks: section(myJsons[0], "IconQuickLinks").cards,
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

                {welcomeImagesData ?
                    <WelcomeImages
                        data={welcomeImagesData} title="MassEnergize"
                    /> : null
                }
                {impactData ?
                    <Graphs
                        graphs={impactData}
                        size={120}
                    /> : null
                }
                {iconQuickLinks ?
                    <IconBoxTable
                        title=""
                        boxes={iconQuickLinks}
                    /> : null
                }
                {events ?
                    <Events
                        events={events}
                    /> : null
                }

            </div>
        );
    }
}
export default HomePage;