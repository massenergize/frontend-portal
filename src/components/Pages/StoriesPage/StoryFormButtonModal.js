import StoryForm from "../ActionsPage/StoryForm";
import Toast from "react-bootstrap/Toast";
import React, { Component } from "react";
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

  getTitle = (formType)=>{
    if(!formType) return ""
    return `Create ${formType} Form`
  }


  //opens modal for the testimonial to be submitted
  TriggerModal = (bool) => {
    this.setState({ OpenModal: bool });
  };
  closeModal() {
    this.props.toggleExternalTrigger && this.props.toggleExternalTrigger();
    this.setState({ OpenModal: false });
  }
  render() {
    const { overrideOpen, reduxProps} = this.props;
    return (
      <>
        <div
          className={this.props.ButtonClasses}
          onClick={() => {
            if (overrideOpen) return overrideOpen();
            this.TriggerModal(true);
          }}
        >
          {this.props.children}
        </div>

        <MEModal
          v2
          show={this.props.openModal || this.state.OpenModal}
          size="md"
          close={this.closeModal.bind(this)}
          title={this.getTitle(this.props.ModalType)}
        >
          <div style={{ textAlign: "left" }}>
            <StoryForm
              ModalType={this.props.ModalType}
              close={this.closeModal.bind(this)}
              draftData={this.props.draftTestimonialData}
              TriggerSuccessNotification={(bool) =>this.TriggerSuccessNotification(bool)}
              TriggerModal={this.closeModal.bind(this)}
              updateItemInRedux={reduxProps?.updateItemInRedux}
              reduxItems={reduxProps?.reduxItems}
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
              <h6>Your {this.props.ModalType} has been submitted! </h6>
            </Toast.Body>
          </Toast>
        </div>
      </>
    );
  }
}

export default StoryFormButtonModal;
