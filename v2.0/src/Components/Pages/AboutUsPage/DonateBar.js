import React from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import MEButton from "../Widgets/MEButton";
/**
 * A display for donating to the cause
 * @props :
 */
class DonateBar extends React.Component {
  render() {
    return (
      <div className="donate-us center p-5" style={{ backgroundColor: "" }}>
        <h4 className="cool-font">{this.props.donateMessage}</h4>
        <br />
        <MEButton to={this.props.links.donate}>Donate</MEButton>
      </div>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    links: store.links,
  };
};
export default connect(mapStoreToProps)(DonateBar);
