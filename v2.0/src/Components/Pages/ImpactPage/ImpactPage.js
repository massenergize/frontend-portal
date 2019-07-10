import React from 'react'
import BarGraph from '../../Shared/BarGraph'
import CircleGraph from '../../Shared/CircleGraph';

class ImpactPage extends React.Component {
    render() {
        return (
            <div className='boxed-wrapper'>
                <div className="row">
                    <div className="col-10 offset-1">
                        <BarGraph
                            title="Households engaged by Category"
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
                    <div className="col-sm-6 col-12">
                        <CircleGraph
                            num={100} goal={200} label={'Households Engaged'} size={150}
                        />
                    </div>
                    <div className="col-sm-6 col-12">
                        <CircleGraph
                            num={357} goal={600} label={"Actions Completed"} size={150}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default ImpactPage;