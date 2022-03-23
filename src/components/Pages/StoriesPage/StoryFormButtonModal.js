import StoryForm from "../ActionsPage/StoryForm";
import Toast from "react-bootstrap/Toast";
import Modal from "react-bootstrap/Modal";
import React, { Component } from "react";


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
        <div
          className={this.props.ButtonClasses}
          onClick={() => {
            this.TriggerModal(true);
          }}
        >
          {this.props.children}
        </div>

        <Modal
          size="lg"
          show={this.state.OpenModal}
          onHide={() => {
            this.TriggerModal(false);
          }}
        >


        <StoryForm
        ModalType={this.props.ModalType}
        close={() => this.setState({ OpenModal: false })}
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
            <Toast.Body className={"Success"}>
              <h6>Submission was successful </h6>
            </Toast.Body>
          </Toast>
        </div>
      </>
    );
  }
}

export default StoryFormButtonModal;
