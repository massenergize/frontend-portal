import React from 'react'
/**
 * A display for donating to the cause
 * @props : 
 */
class DonateBar extends React.Component {
    render() {
        return (
            <div class="donate-us center" style={{backgroundColor: "#eee"}}>
                <h2>We are ECO Green, Our Mission is <span class="thm-color"> save water, animals and environment</span> <br/>our activities are taken around the world.</h2><br/>
                <button class="thm-btn donate-box-btn">donate now</button>
            </div>
        );
    }
}
export default DonateBar;