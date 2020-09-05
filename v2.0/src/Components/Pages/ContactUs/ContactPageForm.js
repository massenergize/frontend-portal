import React, { Component } from "react";
import { apiCall } from "../../../api/functions";
import MEButton from "../Widgets/MEButton";
import METextView from "../Widgets/METextView";
import METextField from "../Widgets/METextField";
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
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  // handleText = (event) => {
  //   let prevContent = this.state.content;
  //   this.setState({
  //     content: { ...prevContent, [event.target.name]: event.target.value },
  //   });
  // };
  // clear() {
  //   document.getElementById("name").value = "";
  //   document.getElementById("email").value = "";
  //   document.getElementById("title").value = "";
  //   document.getElementById("message").value = "";
  // }
  // sendMessage = () => {
  //   let spin = document.getElementById("s_spin");
  //   spin.style.display = "block";
  //   const msg = this.state.content.body;
  //   const name = this.state.content.user_name;
  //   const title = "Message from " + name;
  //   let data = {
  //     community_id: this.props.community_id,
  //     title,
  //     ...DEFAULTS,
  //     ...this.state.content,
  //   };

  //   if (!msg || !name) {
  //     alert("Please provide a message, and name!");
  //     spin.style.display = "none";
  //     return;
  //   }

  //   apiCall("admins.messages.add", data)
  //     .then((res) => {
  //       alert(
  //         "Thanks for contacting the community administrator. You should receive a response within a few days."
  //       );
  //       if (res.success) {
  //         spin.style.display = "none";
  //         this.clear();
  //       }
  //       spin.style.display = "none";
  //     })
  //     .catch((err) => {
  //       spin.style.display = "none";
  //       console.log(err);
  //     });
  // };

  onSubmit(e, content) {
    e.preventDefault();
    console.log("LE CONTENT", content);
    if (!content.body || !content.name) {
      alert("Please provide your name and message");
      return;
    }
    let data = {
      community_id: this.props.community_id,
      ...DEFAULTS,
      ...content,
    };

    apiCall("admins.messages.add", data)
      .then((res) => {
        console.log(
          "Thanks for contacting the community administrator. You should receive a response within a few days."
        );
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
      },
      {
        type: "input",
        name: "email",
        placeholder: "Your Email *",
        required: true,
        history: false,
      },
      {
        type:"file", 
        name:"file", 
      },
      {
        type: "input",
        name: "title",
        placeholder: "Your Title *",
        required: true,
        history: false,
      },
      {
        type: "textarea",
        name: "body",
        placeholder: "Your Message *",
        required: true,
        history: false,
      },
    ];
  }
  render() {
    // className="m-form-outer mob-contact-form-tweak"
    // className="container mob-zero-margin mob-zero-padding me-anime-open-in"
    return (
      <div>
        <div style={{ borderWidth: 0 }}>
          <MEFormGenerator
            onSubmit={this.onSubmit}
            title="Contact Community Organizer Here"
            actionText="Send Message"
            fields={this.neededFields()}
          />
        </div>
      </div>
    );
  }
}

export default ContactPageForm;
