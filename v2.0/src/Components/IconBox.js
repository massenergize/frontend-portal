import React from 'react'
import '../assets/css/style.css';

class IconBox extends React.Component{
    render(){
        return(
                <div className="service-item center">
                    <div className="icon-box">
                        <span className={this.props.icon}></span>
                    </div>
                    <h4>{this.props.title}</h4>
                    <p>{this.props.description}</p>
                    <a href={this.props.link}><button className="button" >More</button></a>
                </div>
        );
    }
}
export default IconBox;