import React from 'react'
/**
 * A display for donating to the cause
 * @props : 
 */
class DonateBar extends React.Component {
    render() {
        return (
            <div className="donate-us center p-5" style={{backgroundColor: "#eee"}}>
                <h2>{this.props.message}</h2><br/>
                <button className="thm-btn donate-box-btn">Donate</button>
            </div>
        );
    }
}
export default DonateBar;