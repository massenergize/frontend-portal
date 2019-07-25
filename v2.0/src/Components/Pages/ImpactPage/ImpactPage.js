import React from 'react'
import BarGraph from '../../Shared/BarGraph'
import CircleGraph from '../../Shared/CircleGraph';
import PageTitle from '../../Shared/PageTitle';

class ImpactPage extends React.Component {
    render() {
        const communityImpact = {
            "categories": ["Wayland", "Weston", "Lincoln", "Concord", "Framingham", "Newton"],
            "series": [
                {
                    name: "Households Engaged",
                    data: [100, 90, 80, 70, 60, 50]
                },
                {
                    name: "Actions Completed",
                    data: [300, 250, 200, 150, 100, 50]
                }
            ]
        };
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
                                    <h4>Graph of Households Engaged by Category</h4>
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
                                    <h4>Graph of Communities and their Impacts</h4>
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

export default ImpactPage;