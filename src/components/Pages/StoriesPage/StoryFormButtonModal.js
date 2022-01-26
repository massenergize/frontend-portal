import StoryForm from "../ActionsPage/StoryForm";
import Toast from "react-bootstrap/Toast";
import Modal from "react-bootstrap/Modal";
import React, { Component } from "react";
import Button from "react-bootstrap/Button";


//refactored the submit testimonial form so now you can have a modal version of it
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
  render() {
    return (
      <>
        <Button
          className={this.props.ButtonClasses}
          onClick={() => {
            this.TriggerModal(true);
          }}
          variant="outline-dark"
        >
          {this.props.children}
        </Button>

        <Modal
          size="lg"
          show={this.state.OpenModal}
          onHide={() => {
            this.TriggerModal(false);
          }}
        >
		  <div className="CloseModalButton"><Button onClick={() => {
            this.TriggerModal(false);
          }} variant="light">Close</Button></div>
          <StoryForm
            draftTestimonialData={this.props.draftTestimonialData}
            TriggerSuccessNotification={(bool) =>
              this.TriggerSuccessNotification(bool)
            }
            TriggerModal={(bool) => this.TriggerModal(bool)}
          />
        </Modal>

        <div className="SuccessNotification">
          <Toast
            autohide={true}
            delay={5000}
            show={this.state.OpenSuccessNotification}
            onClose={() => {
              this.setState({ OpenSuccessNotification: false });
            }}
          >
            <Toast.Header className="SuccessNotification_Header">
              <h4>
                <b>Success!!</b>{" "}
              </h4>
            </Toast.Header>
            <Toast.Body className={"Success"}>
              <h6>The Testimonial has been submitted! </h6>
            </Toast.Body>
          </Toast>
        </div>
      </>
    );
  }
}

export default StoryFormButtonModal;
