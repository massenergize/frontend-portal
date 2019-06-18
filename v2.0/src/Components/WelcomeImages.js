import React from 'react'
import picture1 from '../assets/images/kierans/dandelions.jpg';
import picture2 from '../assets/images/kierans/blur.jpg';
import picture3 from '../assets/images/kierans/moss.jpg';

class WelcomeImages extends React.Component{
    render(){
        //TODO make this only one or only two images depending on screen size.
        return(
            <div className="inner-banner text-center" style={{ backgroundImage: `url(${picture1}), url(${picture2}), url(${picture3})`, backgroundPosition: "left top, center top, right top"}}> 
                <div className="container">
                    <div className="box">
                        <h1>MassEnergize</h1>
                     </div>
                </div>
            </div>
        );
    }
}
export default WelcomeImages;