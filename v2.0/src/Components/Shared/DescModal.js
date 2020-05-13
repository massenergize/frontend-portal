import React, { Component } from 'react'

class DescModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
         
    }
  }
 
  render() {
    const {title, desc } = this.props.content;
    var alot = null; 
    if(desc){
      alot = desc.trim().length >200 ? true : false;
    }
    return (
      <div>
        <div className="modal-box z-depth-2 mob-modal-card">
          <h4 onClick = {()=>{this.props.toggler()}}className=" modal-close-x round-me mob-modal-close-x"><span className="fa fa-close"></span></h4>
          <center>
            <h5>{title}</h5>
            <div>
              <p className={ alot? "make-me-dark mob-modal-p" :" make-me-dark "}>{desc}</p>
            </div>
          </center>
        </div>
        <div id="contact-textarea"className="desc-modal-container" onClick = {()=>{this.props.toggler()}}></div>
      </div>
    )
  }
}

export default DescModal;
