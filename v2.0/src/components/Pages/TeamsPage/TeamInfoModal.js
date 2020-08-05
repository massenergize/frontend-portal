import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";


class TeamInfoModal extends React.Component {

  render() {

    const { team } = this.props;

    //TODO: make sure that this component calls onClose and onComplete callbacks
    //and passes the latter the team ID
    let modalContent;
    if (this.props.user) {
      if (team) {
        //TODO: implement edit team form
      } else {
        //TODO: implement create team form
      }
    } else {
      //the "edit team" button won't render if user isn't signed in, so can just mention creating a team
      modalContent = <p>You must <Link to={this.props.links.signin}>sign in or create an account</Link> to create a team.</p>;
    }

    return (
      <>
        <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal">
            <h4 onClick={() => { this.props.onClose() }} className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
            <h4 style={{ paddingRight: '60px' }}>{team ? <span>Edit <b>{team.name}</b></span> : "Create Team"}</h4>
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

  //TODO: implement functions for accessing fields and doing API calls for both create and edit

}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
  };
};

export default connect(mapStoreToProps, null)(TeamInfoModal);
