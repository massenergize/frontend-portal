import React from 'react'
import LoadingCircle from '../../Shared/LoadingCircle';
import WelcomeImages from '../../Shared/WelcomeImages'
import Graphs from './Graphs';
import IconBoxTable from './IconBoxTable';
import Events from './Events';
import URLS from '../../../api/urls';
import { getJson, section } from '../../../api/functions'
import { connect } from 'react-redux'


/*
* The Home Page of the MassEnergize
*/
class HomePage extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         welcomeImagesData: null,
    //         impactData: null,
    //         iconQuickLinks: null,
    //         events: null,
    //         loaded: false
    //     }
    // }
    // componentDidMount() {
    //     Promise.all([
    //         getJson(URLS.PAGES + "?name=Home"),
    //         getJson(URLS.EVENTS),
    //     ]).then(myJsons => {
    //         this.setState({
                
    //             loaded: true
    //         })
    //     }).catch(err => {
    //         console.log(err)
    //     });
    // }
    render() {
        if (!this.props.pageData) return <LoadingCircle />;
        
        const {pageData, events} = this.props;
        const welcomeImagesData = section(pageData, "WelcomeImages").slider[0].slides;
        const impactData = section(pageData, "Graph Section").graphs[0];
        const iconQuickLinks = section(pageData, "IconQuickLinks").cards;

        // const {
        //     welcomeImagesData,
        //     impactData,
        //     iconQuickLinks,
        //     events
        // } = this.state;

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

const mapStoreToProps = (store) => { 
    return {
        pageData: store.page.homePage,
        events: store.page.events
    }
}
export default connect(mapStoreToProps, null)(HomePage);