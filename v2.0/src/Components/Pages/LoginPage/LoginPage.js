import React from 'react'
import CONST from '../../Constants'
import LoadingCircle from '../../Shared/LoadingCircle'
import LoginForm from './LoginForm'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'

class LoginPage extends React.Component {
    render() { //avoids trying to render before the promise from the server is fulfilled
        //pull form from the url
        const params = new URLSearchParams(this.props.location.search)
        const returnpath = params.get('returnpath');
        console.log(returnpath)
        if(returnpath){
            if (this.props.auth.uid) return <Redirect to={returnpath} />;
        }
        if (this.props.auth.uid) return <Redirect to='/profile' />;
        return (
            <div className="boxed_wrapper">
                <section className="register-section sec-padd-top">
                    <div className="container">
                        <div className="row">
                            {/* <!--Form Column--> */}
                            <div className="form-column column col-md-6 col-12 offset-md-3">
                                <LoginForm />
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
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps)(LoginPage);