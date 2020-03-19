import React, { Component } from 'react'
import { apiCall } from '../../../api/functions'

const DEFAULTS = {
  user_name:null, 
  email:null, 
  body:null, 
  uploaded_file:null
}
class ContactPageForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      content:{}
    }
  }

  handleText =(event)=>{
    let prevContent = this.state.content;
    this.setState({content:{...prevContent,[event.target.name]:event.target.value}})
  }
  clear(){
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("title").value = "";
    document.getElementById("message").value = "";
  }
  sendMessage = ()=>{
    let spin = document.getElementById('s_spin');
    spin.style.display = "block";
    const msg = this.state.content.body;
    const name = this.state.content.user_name;
    const title = "Message from " + name;
    let data = {
      community_id:this.props.community_id,
      title,
      ...DEFAULTS,
      ...this.state.content
    };
    
    if(!msg || !name){
      alert("Please provide a message, and name!")
      spin.style.display = "none";
      return 
    }
  
    apiCall("admins.messages.add",data).then(res=>{
      alert("Thanks for contacting the community administrator. You should receive a response within a few days.");
      console.log(res, data)
     if(res.success){
       spin.style.display = "none";
       this.clear();
     }
     spin.style.display = "none";
   }).catch(err =>{
    spin.style.display = "none";
     console.log(err);
   });
  }
  render() {
    return (
      <div className="container mob-zero-margin mob-zero-padding">
        <div className="m-form-outer z-depth-1 mob-contact-form-tweak">
          <h5 className="text-center" style={{ marginBottom: 9 }}>Contact Community Organizer Here</h5>
          {/* <select name="admin" onChange = {(event)=>{this.handleText(event)}} className="form-control" style={{ margin: 6 }}>
            <option>All</option>
            {mapped}
          </select> */}
          <input id="name" onChange = {(event)=>{this.handleText(event)}} type="text" name="user_name" placeholder="Your Name *" className="form-control m-textbox" />
          <input id ="email" onChange = {(event)=>{this.handleText(event)}}type="email" name="email"  placeholder="Your Email *" className="form-control m-textbox" />
          <input id="title" onChange = {(event)=>{this.handleText(event)}}type="text" name="title"  placeholder="Subject *" className="form-control m-textbox" />
          <textarea id = "message" name="body"onChange = {(event)=>{this.handleText(event)}} className="form-control m-textbox" rows="6" placeholder="Your message"></textarea>
          <small id="s_spin" className='text text-success pull-left' style={{display:'none',fontWeight:'700',margin:20}}><i className="fa fa-spinner fa-spin"></i> sending... </small>
          <button onClick = {()=>{this.sendMessage()}}className="raise btn btn-success pull-right m-btn">Send Message</button>
        </div>
      </div>
    )
  }
}

export default ContactPageForm
