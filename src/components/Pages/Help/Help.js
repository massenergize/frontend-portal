import React, { Component } from 'react'

export default class Help extends Component {
  render() {
    return (
      <div style={{height:"100vh",  margin:'auto 20%'}}>
        {/* <center> */}
        {/* <h1>Help And Information Page</h1> */}
        <h3 style={{margin:20, textDecoration:"underline"}}>How To Delete All Your Data From MassEnergize</h3>
        <p>In order to clear out all information that have been willingly given by you from the MassEnergize platform, please take note of the 
        following steps </p>
        <ol>
          <li>Sign into your profile</li>
          <li>Toggle the shinny green button on the top left corner of your screen and go to your profile</li>
          <li>Again, toggle the round dropdown button that is displayed beside "Welcome  ....your name..."</li>
          <li>On the dropdown, you will find the option to "delete profile". Go ahead and confirm deletion, and you are good to go.<br/> All your information you have shared with MassEnergize, will be completely deleted</li>
        </ol>
        {/* </center> */}
      </div>
    )
  }
}
