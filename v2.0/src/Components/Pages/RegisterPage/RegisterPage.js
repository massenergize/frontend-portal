import React from 'react'
import RegisterForm from './RegisterForm'

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
       this.state= {
           form: null,
       }
    }
    //gets the data from the api url and puts it in pagedata and menudata
    componentDidMount() {
        //pull form from the url
        const params = new URLSearchParams(this.props.location.search)
        this.setState({
            ...this.state,
            form: parseInt(params.get('form'))
        })
    }

    render() { //avoids trying to render before the promise from the server is fulfilled        
        return (
            <div className="boxed_wrapper">
                <section className="register-section sec-padd-top">
                    <div className="container">
                        <div className="row">
                            {/* <!--Form Column--> */}
                            <div className="form-column column col-md-6 col-12 offset-md-3">
                                <RegisterForm form={this.state.form}/>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
} export default RegisterPage;