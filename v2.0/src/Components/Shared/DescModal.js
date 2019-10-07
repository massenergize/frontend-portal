import React, { Component } from 'react'

class DescModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
         
    }
  }
 
  render() {
    const {title, desc } = this.props.content;
    return (
      <div>
        <div className="modal-box">
          <h4 onClick = {()=>{this.props.toggler()}}className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
          <center>
            <h5>{title}</h5>
            <div>
              <p>{desc}</p>
            </div>
          </center>
        </div>
        <div className="desc-modal-container" onClick = {()=>{this.props.toggler()}}></div>
      </div>
    )
  }
}

export default DescModal;
