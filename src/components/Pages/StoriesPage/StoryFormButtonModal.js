import StoryForm from "../ActionsPage/StoryForm";
import Toast from "react-bootstrap/Toast";
import React, { Component } from "react";
import MEButton from "../Widgets/MEButton";
import MEModal from "../Widgets/MEModal";

//refactored the submit testimonial form so now you can have a modal version of it
// TODO: We will have to refactor again, some structures and names cld work better in diff way. (Do when there is time)
class StoryFormButtonModal extends Component {
  constructor() {
    super();
    this.state = {
      OpenSuccessNotification: false,
    };
  }

  //opens notification that the testimonial submit was a success
  TriggerSuccessNotification = (bool) => {
    this.setState({
      OpenSuccessNotification: bool,
    });
  };

  //opens modal for the testimonial to be submitted
  TriggerModal = (bool) => {
    this.setState({ OpenModal: bool });
  };
  closeModal() {
    this.props.toggleExternalTrigger && this.props.toggleExternalTrigger();
    this.setState({ OpenModal: false });
  }
  render() {
    return (
      <>
        <MEButton
          className={this.props.ButtonClasses}
          onClick={() => {
            this.TriggerModal(true);
          }}
        >
          {this.props.children}
        </MEButton>

        <MEModal
          v2
          show={this.props.openModal || this.state.OpenModal}
          size="md"
          close={this.closeModal.bind(this)}
        >
          <div style={{ textAlign: "left" }}>
            <StoryForm
              close={this.closeModal.bind(this)}
              draftTestimonialData={this.props.draftTestimonialData}
              TriggerSuccessNotification={(bool) =>
                this.TriggerSuccessNotification(bool)
              }
              TriggerModal={this.closeModal.bind(this)}
            />
          </div>
        </MEModal>

        <div className="SuccessNotification">
          <Toast
            autohide={true}
            delay={5000}
            show={this.state.OpenSuccessNotification}
            onClose={() => {
              this.setState({ OpenSuccessNotification: false });
            }}
          >
            <Toast.Body className={"Success"}>
              <h6>Your testimonial has been submitted! </h6>
            </Toast.Body>
          </Toast>
        </div>
      </>
    );
  }
}

export default StoryFormButtonModal;
