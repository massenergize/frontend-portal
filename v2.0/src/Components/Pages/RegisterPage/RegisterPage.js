import React from 'react'
import RegisterForm from './RegisterForm'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import {connect} from 'react-redux'

class RegisterPage extends React.Component {
    render() { //avoids trying to render before the promise from the server is fulfilled  
        return (
            <>
                <BreadCrumbBar links={[{ name: 'Sign Up' }]} />
                <div className="boxed_wrapper">
                    <section className="register-section sec-padd-top">
                        <div className="container">
                            <div className="row">
                                {/* <!--Form Column--> */}
                                <div className="form-column column col-md-6 col-12 offset-md-3">
                                    {this.props.location.pathname !== this.props.links.signup ? <p style={{ color: 'red' }}> Please finish creating your account before you continue</p> : null}
                                    <RegisterForm />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </>
        );
    }
} 
const mapStoreToProps = (store) => {
    return({
        links: store.links
    });
}
export default connect(mapStoreToProps)(RegisterPage);