import React from 'react'
import BarGraph from '../../Shared/BarGraph'
import CircleGraph from '../../Shared/CircleGraph';
import PageTitle from '../../Shared/PageTitle';
import { connect } from 'react-redux';
import LoadingCircle from '../../Shared/LoadingCircle';
import {getJson} from '../../../api/functions'
import URLS from '../../../api/urls'
import {reduxLoadCommunitiesStats} from '../../../redux/actions/pageActions'

class ImpactPage extends React.Component {
    render() {
        if(!this.props.communitiesStats || this.props.communitiesStats.length <= 0){
            getJson(URLS.COMMUNITIES_STATS).then(json => {
                console.log(json);
                if(json.success){
                    this.props.reduxLoadCommunitiesStats(json.data.length>0? json.data : null)
                }
            })
            return <LoadingCircle/>
        } 
        let stats = this.props.communitiesStats.slice(0);
        
        // TODO: Render sidebar graphs

        // Replace Households Engaged by Categories with Actions Completed by Category

        stats = stats.sort((a, b) => {
            return b.actions_completed - a.actions_completed;
        });

        let communityImpact = {
            // "categories": ["Wayland", "Weston", "Lincoln", "Concord", "Framingham", "Newton"],
            "categories": [],
            "series": [
                {
                    name: "Households Engaged",
                    // data: [100, 90, 80, 70, 60, 50]
                    data: []
                },
                {
                    name: "Actions Completed",
                    // data: [300, 250, 200, 150, 100, 50]
                    data: []
                }
            ]
        };

        stats.forEach(comm => {
            communityImpact.categories.push(comm.community.name);
            communityImpact.series[0].data.push(comm.households_engaged);
            communityImpact.series[1].data.push(comm.actions_completed);
        });

        return (
            <div className='boxed-wrapper'>
                <div className="container bg-light p-5">
                    <PageTitle>Our Community's Impact</PageTitle>
                    <div className="row">
                        <div className="col-12 col-lg-4">
                            <div className="card rounded-0 mb-4">
                                <div className="card-body">
                                    <CircleGraph
                                        num={100} goal={200} label={'Households Engaged'} size={150}
                                        colors={["#428a36"]}
                                    />
                                </div>
                            </div>
                            <div className="card rounded-0 mb-4">
                                <div className="card-body">
                                    <CircleGraph
                                        num={357} goal={600} label={"Actions Completed"} size={150}
                                        colors={["#FB5521"]}
                                    />
                                </div>
                            </div>
                            <div className="card rounded-0 mb-4">
                                <div className="card-body">
                                    <CircleGraph
                                        num={123} goal={456} label={"Example Graph"} size={150}
                                        colors={["#999999"]}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-8">
                            <div className="card rounded-0 mb-4">
                                <div className="card-header text-center bg-white">
                                    <h4>Households Engaged by Category</h4>
                                </div>
                                <div className="card-body">
                                    <BarGraph
                                        categories={[
                                            "Home Energy",
                                            "Clean Transportation",
                                            "Lighting",
                                            "Solar",
                                            "Food",
                                            "Water",
                                            "Trash and Recycling",
                                            "Activism and Education"
                                        ]}
                                        series={[{
                                            name: "Households Engaged",
                                            data: [67, 27, 100, 307, 153, 221, 103, 34]
                                        }]}
                                        colors={["#428a36"]}
                                    />
                                </div>
                            </div>

                            <div className="card rounded-0 mb-4">
                                <div className="card-header text-center bg-white">
                                    <h4>Communities and their Impacts</h4>
                                </div>
                                <div className="card-body">
                                    <BarGraph
                                        categories={communityImpact.categories}
                                        series={communityImpact.series}
                                        colors={["#428a36", "#FB5521"]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStoreToProps = (store) => { 
    return {
        communitiesStats: store.page.communitiesStats
    }
}
export default connect(mapStoreToProps, {reduxLoadCommunitiesStats})(ImpactPage);