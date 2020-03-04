import React, { Component } from 'react'
import leafy from './leafy.png';
class StoryModal extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }

  render() {
    return (
      <div>
        <div className="modal-box z-depth-2 mob-modal-card"  style={{height:630,top:'19%'}}>
          <h4 className=" modal-close-x mob-modal-close-x round-me" onClick = {()=>{this.props.close()}}><span className="fa fa-close"></span></h4>
          <center>
            <h5 className="mob-modal-tittle" style={{ marginBottom:-10, textTransform: 'capitalize' }}>{this.props.content.title}</h5>
            <div>
              {!this.props.content.image ?
                <img className="testi-green-monster mob-modal-pic-tweak " src={leafy} alt="IMG"/>
                :
                <img className="testi-modal-pic  mob-modal-pic-tweak" src={this.props.content.image.url} alt="IMG"/>
              }
              <div style={{marginTop:30 ,maxHeight:610,overflowY:'scroll'}}>
              <p className="mob-modal-p">{this.props.content.desc}</p>
              </div>
            </div>
          </center>
        </div>
        <div id="contact-textarea" onClick = {()=>{this.props.close()}} className="desc-modal-container" ></div>
      </div>
    )
  }
}

export default StoryModal
