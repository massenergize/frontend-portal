import React from 'react'
import BarGraph from '../../Shared/BarGraph'
import CircleGraph from '../../Shared/CircleGraph';

class ImpactPage extends React.Component {
    render() {
        return (
            <div className='boxed-wrapper'>
                <div className="container bg-light p-5">
                    <div className="row text-center justify-content-center mb-5 border-bottom">
                        <h1>Our Community's Impact</h1>
                    </div>
                    <div className="row">
                        <div className="col-12 col-lg-4">
                            <div class="card rounded-0" style={{"margin-bottom": "30px"}}>
                                <div class="card-body">
                                    <CircleGraph
                                        num={100} goal={200} label={'Households Engaged'} size={150}
                                    />
                                </div>
                            </div>
                            <div class="card rounded-0">
                                <div class="card-body">
                                    <CircleGraph
                                        num={357} goal={600} label={"Actions Completed"} size={150}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-8">
                            <div class="card rounded-0">
                                <div class="card-header text-center bg-white">
                                    <h4>Graph of Households Engaged by Category</h4>
                                </div>
                                <div class="card-body">
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
                                        series={{
                                            name: "Households Engaged",
                                            data: [67, 27, 100, 307, 153, 221, 103, 34]
                                        }}
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