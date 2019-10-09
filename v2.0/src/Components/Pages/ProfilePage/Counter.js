import React from 'react'
import CountUp from 'react-countup'

class Counter extends React.Component {

    constructor(props){
        super(props);
        this.state={
            speed: 3000,
            count: 0,

        }
    }

    render() {
        return (
                <div className="item count-cardy z-depth-1">
                    <br/><br/>
                    <div className="icon">
                        <i className={this.props.icon}></i>
                    </div>
                    <div className="count-outer">
                        <CountUp end={this.props.end} duration={3}/>
                    </div>
                    <h6 className="">{this.props.title}</h6>
                </div>
        );
    }
}
export default Counter;




