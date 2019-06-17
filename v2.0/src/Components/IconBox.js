import React from 'react'
import '../assets/css/style.css';

class IconBox extends React.Component{
    render(){
        return(
                <div className="service-item center">
                    <div className="icon-box">
                        <span className={this.props.icon}></span>
                    </div>
                    <h4>{this.props.name}</h4>
                    <p>{this.props.description}</p>
                    <button className="button" >More</button>
                </div>
        );
    }
}
export default IconBox;