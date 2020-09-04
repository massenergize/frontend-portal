import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import loader from '../../../assets/images/other/loader.gif';

class ContactAdminModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null
    }
  }

  render() {
    const { team, user, links, onClose } = this.props;
    const { loading, error } = this.state;

    let modalContent;
    if (user) {

      modalContent = (
        <form onSubmit={(e) => {
          e.preventDefault();
          this.sendMessage();
        }
        }>
          <div>
            <input id="contact-title" type="text" name="title" className="form-control" placeholder="Title..." reqiured style={{ marginBottom: "10px" }} />
            <textarea id="contact-textarea" name="msg" className="form-control" rows={5} placeholder="Message..." required>
            </textarea>
            <div className="team-modal-button-wrapper">
              <button
                style={{ marginTop: '10px', marginBottom: '0px', padding: '10px 40px' }}
                type="submit"
                className="btn btn-success round-me contact-admin-btn-new raise"
              >
                Send
            </button>
              {loading && <img src={loader} alt="" className="team-modal-loader team-modal-inline" />}
              {error && <p className className="error-p team-modal-error-p team-modal-inline">{error}</p>}
              <br />
            </div>
          </div>
        </form>);
    } else {
      modalContent = <p>You must <Link to={links.signin}>sign in or create an account</Link> to contact this team's admin</p>;
    }

    return (
      <>
        <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal">
            <h4 onClick={() => { onClose() }} className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
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

  sendMessage = async () => {
    const msg = document.getElementById("contact-textarea").value;
    const title = document.getElementById("contact-title").value;

    const { team, onClose } = this.props;

    if (msg !== "" && title !== "") {
      const body = {
        team_id: team.id,
        title: title,
        message: msg,
      };
      try {
        this.setState({ loading: true });
        const json = await apiCall(`teams.contactAdmin`, body);
        if (json.success) {
          onClose();
        } else {
          this.setState({ error: json.error });
        }
      } catch (err) {
        this.setState({ error: err });
      } finally {
        this.setState({ loading: false });
      }
    }
  }
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
  };
};

export default connect(mapStoreToProps, null)(ContactAdminModal);
