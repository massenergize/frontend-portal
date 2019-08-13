import React from 'react';
import { section } from '../../../api/functions';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
/**
 * A display for donating to the cause
 * @props : 
 */
class DonateBar extends React.Component {
    render() {
        return (
            <div className="donate-us center p-5" style={{backgroundColor: "#eee"}}>
                <h2>{this.props.donateMessage}</h2>
                <br/>
                <Link to="donate"><button className="thm-btn donate-box-btn">Donate</button></Link>
            </div>
        );
    }
}

export default DonateBar;