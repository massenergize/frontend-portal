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
        const pageSections = this.props.donatePage.sections;
        const header = section(pageSections, "DonatePageHeader", true);
        return (
            <div className="donate-us center p-5" style={{backgroundColor: "#eee"}}>
                <h2>{header.title}</h2>
                <br/>
                <Link to="donate"><button className="thm-btn donate-box-btn">Donate</button></Link>
            </div>
        );
    }
}
const mapStoreToProps = (store) => {
    return {
        donatePage: store.page.donatePage,
    }
}
export default connect(mapStoreToProps, null)(DonateBar);