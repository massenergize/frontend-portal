import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import loader from "../../../assets/images/other/loader.gif";
import MEModal from "../Widgets/MEModal";
import FormGenerator from "../Widgets/FormGenerator/MEFormGenerator";

class ContactAdminModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      notification: null,
    };
    this.doSending = this.doSending.bind(this);
  }

  getNeededFields() {
    return [
      {
        hasLabel: true,
        type: "input",
        label: "Subject",
        placeholder: "Enter subject here...",
        name: "subject",
        required: true,
        value: "",
      },
      {
        hasLabel: true,
        type: "textarea",
        label: "Message",
        placeholder: "Enter message here...",
        name: "body",
        required: true,
        value: "",
      },
    ];
  }

  render() {
    const { team, user, links, onClose } = this.props;
    // const { loading, error } = this.state;

    let modalContent;
    if (user) {
      modalContent = (
        <FormGenerator
          style={{ padding: 0, margin: 0 }}
          elevate={false}
          animate={false}
          fields={this.getNeededFields()}
          actionText="Send"
          onSubmit={this.doSending}
          info={this.state.notification}
        />
      );
    } else {
      modalContent = (
        <p>
          You must <Link to={links.signin}>sign in or create a profile</Link>{" "}
          to contact this team's admin
        </p>
      );
    }
 
    return (
      <>
        <MEModal
        size="md"
          containerClassName="mob-modal-correction modal-force-full-width"
          closeModal={() => onClose()}
        >
          <h4>
            Contact admin of <b>{team && team.name}</b>
          </h4>
          {modalContent}
        </MEModal>
      </>
    );
  }

  notify(message, type, icon) {
    this.setState({
      notification: {
        icon: icon,
        type: type,
        text: message,
      },
    });
  }
 
  doSending(e, data, resetForm) {
    e.preventDefault();
    this.notify("Sending...", "good", "fa fa-spinner fa-spin");
    if (!data || data.isNotComplete) return;
    this.sendMessage(data);
  }

  sendMessage = async (body) => {
    const { team, onClose } = this.props;
    body = { ...body, team_id: team && team.id };
    try {
      // this.setState({ loading: true });
      const json = await apiCall(`teams.contactAdmin`, body);
      if (json.success) {
        this.notify("Message sent", "good", "fa fa-check");
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        this.notify(json.err, "bad", "fa fa-times");
      }
    } catch (err) {
      this.notify(err.toString(), "bad", "fa fa-times");
    } finally {
      // this.setState({ loading: false });
    }
  };
  // };
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
  };
};

export default connect(mapStoreToProps, null)(ContactAdminModal);
