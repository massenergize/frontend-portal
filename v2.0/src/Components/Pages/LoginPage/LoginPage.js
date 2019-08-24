import React from 'react'
import LoginForm from './LoginForm'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'

class LoginPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            tryingToLogin:false
        }
    }
    render() { //avoids trying to render before the promise from the server is fulfilled
        //pull form from the url
        // const params = new URLSearchParams(this.props.location.search)
        // const returnpath = params.get('returnpath');
        if(!this.state.tryingToLogin){
            if(this.props.user.info)
                return <Redirect to='/profile'/>
            if(this.props.auth.isLoaded && !this.props.auth.isEmpty)
                return <Redirect to='/register'/>
        }

        return (
            <div className="boxed_wrapper">
                <section className="register-section sec-padd-top">
                    <div className="container">
                        <div className="row">
                            {/* <!--Form Column--> */}
                            <div className="form-column column col-md-6 col-12 offset-md-3">
                                <LoginForm tryingToLogin={(status) => this.setState({tryingToLogin:status})}/>
                            </div>
                        </div>
                    </div>
                </section>
                
            </div>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth,
        user: store.user
    }
}
export default connect(mapStoreToProps)(LoginPage);