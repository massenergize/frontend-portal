import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";


class CreateTeamModal extends React.Component {

  render() {

    let modalContent;
    if (this.props.user) {
      //TODO: implement form and API calls
      modalContent = <></>;
    } else {
      modalContent = <p>You must <Link to={this.props.links.signin}>sign in or create an account</Link> to create a team.</p>;
    }

    return (
      <>
        <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal">
            <h4 onClick={() => { this.props.onClose() }} className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
            <h4 style={{ paddingRight: '60px' }}>Create Team</h4>
            <br />
            <div className="boxed_wrapper">
              {modalContent}
            </div>
          </div>
        </div>
        <div className="desc-modal-container">
        </div>
      </>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
  };
};

export default connect(mapStoreToProps, null)(CreateTeamModal);
