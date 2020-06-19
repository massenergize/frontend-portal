import React, { Component } from 'react'
import oops from './oops.png';
import { Link } from "react-router-dom";

class Error404 extends Component {

  render() {
    const def = "Sorry - the page you are looking for could not be found!";
    const msg = this.props.message ? this.props.message : def;
    return (
      <div>
        <div className="boxed_wrapper" style={{ paddingTop: 221, height: window.screen.height }}>
          <center>
            <img alt="404" src={oops} style={{ marginBottom: 20, height: 200, width: 200 }} />
            <h1 style={{ color: 'lightgray' }}>OOPS!</h1>

            <h3 className='text-center' style={{ marginBottom: 20, color: 'lightgray' }}> {msg}</h3>
            <p className='text-center'>
              <Link to={"http://" + window.location.host} className="mass-domain-link ">
                Find My Community
              </Link> </p>
          </center>

        </div>
      </div>
    )
  }
}

export default Error404
