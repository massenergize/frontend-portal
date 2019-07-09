import React from 'react'
import CONST from '../../Constants'
import LoadingCircle from '../../Shared/LoadingCircle'
import RegisterForm from './RegisterForm'

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
        }
    }
    //gets the data from the api url and puts it in pagedata and menudata
    componentDidMount() {
        fetch(CONST.URL.MENU).then(data => {
            return data.json()
        }).then(myJson => {
            this.setState({
                userData: myJson.userData,
            });
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() { //avoids trying to render before the promise from the server is fulfilled
        if (!this.state.userData) return <LoadingCircle />;
        
        return (
            <div className="boxed_wrapper">
                <section class="register-section sec-padd-top">
                    <div class="container">
                        <div class="row">
                            {/* <!--Form Column--> */}
                            <div class="form-column column col-md-6 col-12 offset-md-3">
                                <RegisterForm />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
} export default RegisterPage;