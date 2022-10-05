import React, { Component } from "react";
import { apiCall } from "../../../api/functions";
import MEFormGenerator from "../Widgets/FormGenerator/MEFormGenerator";

const DEFAULTS = {
  user_name: null,
  email: null,
  body: null,
  uploaded_file: null,
};
class ContactPageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: {},
      formNotification: null,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e, content, resetForm) {
    e.preventDefault();
    if (!content.body || !content.name) {
      this.setState({
        formNotification: {
          icon: "fa fa-times",
          type: "bad",
          text: "Please provide a name & message...",
        },
      });
      return;
    }
    let data = {
      community_id: this.props.community_id,
      ...DEFAULTS,
      ...content,
    };

    const _this = this;
    apiCall("admins.messages.add", data)
      .then((res) => {
        if (res.success && res.data) {
          _this.setState({
            formNotification: {
              icon: "fa fa-check",
              type: "good",
              text:
                "Thanks for contacting the community administrator. You should receive a response within a few days.",
            },
          });
          resetForm();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  neededFields() {
    return [
      {
        type: "input",
        name: "name",
        placeholder: "Your Name *",
        required: true,
        history: false,
        value: "",
      },
      {
        type: "input",
        name: "email",
        placeholder: "Your Email *",
        required: true,
        history: false,
        value: "",
      },
      {
        type: "input",
        name: "title",
        placeholder: "Subject *",
        required: true,
        history: false,
        value: "",
      },
      {
        type: "textarea",
        name: "body",
        placeholder: "Message *",
        required: true,
        history: false,
        value: "",
      },
    ];
  }
  render() {
    // className="m-form-outer mob-contact-form-tweak"
    // className="container mob-zero-margin mob-zero-padding me-anime-open-in"
    return (
      <div>
        <div style={{ borderWidth: 0 }} id = "test-contact-us-form">
          <MEFormGenerator
            onSubmit={this.onSubmit}
            title="Contact Community Admin"
            actionText="Send Message"
            fields={this.neededFields()}
            info={this.state.formNotification}
          />
        </div>
      </div>
    );
  }
}

export default ContactPageForm;
