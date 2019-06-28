import React from 'react'
/**
 * A display for donating to the cause
 * @props : 
 */
class DonateBar extends React.Component {
    render() {
        return (
            <div className="donate-us center p-5" style={{backgroundColor: "#eee"}}>
                <h2>We are ECO Green, Our Mission is <span className="thm-color"> save water, animals and environment</span> <br/>our activities are taken around the world.</h2><br/>
                <button className="thm-btn donate-box-btn">donate now</button>
            </div>
        );
    }
}
export default DonateBar;