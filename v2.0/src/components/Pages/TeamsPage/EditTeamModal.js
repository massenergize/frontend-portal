import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";

class EditTeamModal extends React.Component {

  render() {

    const { team } = this.props;

    return (
      <>
        <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal">
            <h4 onClick={() => { this.props.onClose() }} className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
            <h4 style={{ paddingRight: '60px' }}>Edit <b>{team.name}</b></h4>
            <br />
            <div className="boxed_wrapper">
              {/* TODO: implement form and API calls */}
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

export default connect(mapStoreToProps, null)(EditTeamModal);
