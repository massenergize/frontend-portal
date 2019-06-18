import React from 'react'

class CircleGraph extends React.Component{
    render(){
        return(
            <div>
                <div className="col-md-4 col-sm-6 col-xs-12 item text-center">
                    <div className="pie-title-center knob" data-percent={this.props.percent}> 
                        <span className="pie-value">{this.props.percent+"%"}</span> 
                    </div>
                    <p>{this.props.title}</p>
                </div>
            </div>
        );
    }
}
export default CircleGraph;