import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class ContactAdminModal extends React.Component {

  render() {

    const team = this.props.team;

    let modalContent;
    if (this.props.user) {

      modalContent = (
        <form onSubmit={(e) => {
          e.preventDefault();
          this.sendMessage();
        }
        }>
          <div>
            <input id="contact-title" type="text" name="title" className="form-control" placeholder="Title..." reqiured style={{ marginBottom: "10px" }} />
            <textarea id="contact-textarea" name="msg" className="form-control" rows={7} placeholder="Message..." required>
            </textarea>
            <button
              style={{ marginTop: '10px', marginBottom: '0px' }}
              type="submit"
              className="btn btn-success round-me contact-admin-btn-new raise"
            >
              Send
                </button>

            <br />

            <span id="sender-spinner" style={{ display: 'none' }} className="text text-success">sending <i className="fa fa-spinner fa-spin" /></span>
          </div>
        </form>);
    } else {
      modalContent = <p>You must <Link to={this.props.links.signin}>sign in or create an account</Link> to contact this team's admin</p>;
    }

    return (
      <>
        <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal">
            <h4 onClick={() => { this.props.onClose() }} className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
            <h4 style={{ paddingRight: '60px' }}>Contact admin of <b>{team.name}</b></h4>
            <br />
            {modalContent}
          </div>
        </div>
        <div className="desc-modal-container">
        </div>
      </>
    );
  }

  sendMessage = () => {
    var spinner = document.getElementById("sender-spinner");
    var msg = document.getElementById("contact-textarea").value;
    var title = document.getElementById("contact-title").value;

    const body = {
      team_id: this.props.team.id,
      title: title,
      message: msg,
    };

    if (msg !== "" && title !== "") {
      spinner.style.display = "block";
      apiCall(`teams.contactAdmin`, body)
        .then((json) => {
          document.getElementById("contact-textarea").value = "";
          document.getElementById("contact-title").value = "";
          spinner.style.display = "none";

          this.props.onClose();
        });
    }
  };
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
  };
};

export default connect(mapStoreToProps, null)(ContactAdminModal);