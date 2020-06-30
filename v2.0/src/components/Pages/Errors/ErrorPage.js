import React from 'react';
import oops from './oops.png';

class ErrorPage extends React.Component {

  render() {

    let errorMessage, errorDescription;

    if (this.props.location.state) {
      errorMessage = this.props.location.state.errorMessage && this.props.location.state.errorMessage;
      errorDescription = this.props.location.state.errorDescription && this.props.location.state.errorDescription;
    }

    //TODO: describe the ways in which user can help report the error

    return (
      <div>
        <div className="boxed_wrapper" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
          <center>
            <img alt="404" src={oops} style={{ marginBottom: 20, height: 100, width: 100 }} />
            {errorMessage ?
              <h1 style={{ color: 'lightgray' }}>Error: {errorMessage}</h1>
              :
              <h1 style={{ color: 'lightgray' }}>An error has occured.</h1>
            }
            {errorDescription ?
              <h3 className='text-center' style={{ marginBottom: 20, color: 'lightgray' }}> {errorDescription}</h3>
              :
              <h3 className='text-center' style={{ marginBottom: 20, color: 'lightgray' }}> We are unable to locate its source.</h3>
            }
          </center>

        </div>
      </div >
    );
  }
}

export default ErrorPage;