import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
/**
 * A display for donating to the cause
 * @props : 
 */
class DonateBar extends React.Component {
    render() {
        return (
            <div className="donate-us center p-5" style={{backgroundColor: ""}}>
                <h3 className="cool-font">{this.props.donateMessage}</h3>
                <br/>
                <Link to={this.props.links.donate}><button className=" thm-btn donate-box-btn action-btns">Donate</button></Link>
            </div>
        );
    }
}
const mapStoreToProps = (store) => {
    return({
        links: store.links
    });
}
export default connect(mapStoreToProps)(DonateBar);