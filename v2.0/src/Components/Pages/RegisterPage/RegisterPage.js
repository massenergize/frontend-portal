import React from 'react'
import RegisterForm from './RegisterForm'

class RegisterPage extends React.Component {
    render() { //avoids trying to render before the promise from the server is fulfilled  
        return (
            <div className="boxed_wrapper">
                <section className="register-section sec-padd-top">
                    <div className="container">
                        <div className="row">
                            {/* <!--Form Column--> */}
                            <div className="form-column column col-md-6 col-12 offset-md-3">
                                <RegisterForm/>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
} export default RegisterPage;