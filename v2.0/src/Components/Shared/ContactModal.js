import React, { Component } from 'react'

class ContactModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
         
    }
  }
 
  render() {
    const {title } = this.props.content;
    
    return (
      <div>
        <div className="modal-box z-depth-2">
          <h4 onClick = {()=>{this.props.toggler()}}className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
          <center>
            <h5>{title}</h5>
            <p>Send a message to this team's admin</p>
            <div>
              <input id="contact-title" type="text" name ="title" className="form-control" onChange = {(event)=>this.props.handleTextFxn(event)} style={{padding:15,marginBottom:7}} placeholder ="Title..." />
              <textarea id="contact-textarea" name="msg" onChange = {(event)=>this.props.handleTextFxn(event)} className="form-control" style={{padding:15}} rows={7} placeholder="Message...">

              </textarea>
              <button className="btn btn-success raise round-me" style={{margin:10,padding:"10px 50px"}} onClick = {()=>{this.props.sendMessageFxn(); }}>Send</button>
              <br/><span id="sender-spinner"  style={{display:'none'}} className="text text-success">sending <i className="fa fa-spinner fa-spin"/></span>
            </div>
          </center>
        </div>
        <div className="desc-modal-container"  onClick = {()=>{this.props.toggler()}}></div>
      </div>
    )
  }
}

export default ContactModal;
