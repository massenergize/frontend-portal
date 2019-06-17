import React from 'react'
import '../assets/css/style.css';

class Action extends React.Component{
    render(){
        return(
                <div className="service-item center">
                    <div className="icon-box">
                        <span className="icon-can"></span>
                    </div>
                    <h4>{this.props.actionName}</h4>
                    <p>{this.props.actionDescription}</p>
                    <button className="button" >More</button>
                </div>
        );
    }
}
export default Action;