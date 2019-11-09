import React, { Component } from 'react'
import { apiCall } from '../../../api/functions'

const DEFAULTS = {
 // admin:"All", 
  name:null, 
  email:null, 
  phone:null, 
  message:null
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
    document.getElementById("phone").value = "";
    document.getElementById("message").value = "";
  }
  sendMessage = ()=>{
    let spin = document.getElementById('s_spin');
    spin.style.display = "block";
    let data = {community_id:this.props.community_id,...DEFAULTS,...this.state.content};
    const msg = this.state.content.message;
    const name = this.state.content.name;
    if(!msg || !name){
      alert("Please provide a message, and name!")
      spin.style.display = "none";
      return 
    }
    apiCall("admins.message",data).then(res=>{
     console.log(res);
     if(res.sucess){
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
    // const { admins } = this.props;
    // var mapped = null;
    // if (admins) {
    //   mapped = admins.map((admin, index) => { return <option>{admin.email}</option> })
    // }
    return (
      <div className="container">
        <div className="m-form-outer z-depth-1">
          <h5 className="text-center" style={{ marginBottom: 9 }}>Contact Admins Here</h5>
          {/* <select name="admin" onChange = {(event)=>{this.handleText(event)}} className="form-control" style={{ margin: 6 }}>
            <option>All</option>
            {mapped}
          </select> */}
          <input id="name" onChange = {(event)=>{this.handleText(event)}} type="text" name="name" placeholder="Your Name" className="form-control m-textbox" />
          <input id ="email" onChange = {(event)=>{this.handleText(event)}}type="email" name="email"  placeholder="Your Email" className="form-control m-textbox" />
          <input id="phone" onChange = {(event)=>{this.handleText(event)}}type="number" name="phone"  placeholder="Your Phone" className="form-control m-textbox" />
          <textarea id = "message" name="message"onChange = {(event)=>{this.handleText(event)}} className="form-control m-textbox" rows="6" placeholder="Your message"></textarea>
          <small id="s_spin" className='text text-success pull-left' style={{display:'none',fontWeight:'700',margin:20}}><i className="fa fa-spinner fa-spin"></i> sending... </small>
          <button onClick = {()=>{this.sendMessage()}}className="raise btn btn-success pull-right m-btn">Send Message</button>
        </div>
      </div>
    )
  }
}

export default ContactPageForm
