import React, { Component } from 'react'

class DescModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
         
    }
  }
 
  render() {
    

    return (
      <div>
        <div className="modal-box z-depth-2 mob-modal-card">
          <h4 onClick = {()=>{this.props.toggler()}}className=" modal-close-x round-me mob-modal-close-x"><span className="fa fa-close"></span></h4>
          <center>
            <h5 className="mob-team-title">{title}</h5>
            <div>
              <p className={ alot? "make-me-dark mob-modal-p mob-team-text" :" make-me-dark mob-team-text "}>{desc}</p>
            </div>
          </center>
        </div>
        <div id="contact-textarea"className="desc-modal-container" onClick = {()=>{this.props.toggler()}}></div>
      </div>
    )
  }
}

export default DescModal;
