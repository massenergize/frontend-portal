import React from 'react'
import { withFirebase } from '../../Firebase';
import { withRouter } from 'react-router-dom';
import {compose} from 'recompose';
/********************************************************************/
/**                        LOGIN FORM                               */
/********************************************************************/
const INITIAL_STATE = {
    email: '',
    password: '',
    error: null
};

class LoginFormBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.onChange = this.onChange.bind(this);
        this.isInvalid = this.isInvalid.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    render() {
        const {
            email,
            password,
            error
        } = this.state;
        return (
            < div class="styled-form login-form" >
                <div class="section-title style-2">
                    <h3>Login Now</h3>
                </div>
                <form onSubmit={this.onSubmit}>
                    <div class="form-group">
                        <span class="adon-icon"><span class="fa fa-envelope-o"></span></span>
                        <input type="email" name="email" value={email} onChange={this.onChange} placeholder="Enter email" />
                    </div>
                    <div class="form-group">
                        <span class="adon-icon"><span class="fa fa-unlock-alt"></span></span>
                        <input type="password" name="password" value={password} onChange={this.onChange} placeholder="Enter Password" />
                    </div>
                    {error && <p style={{ color: "red" }}> {error} </p>}
                    <div class="clearfix">
                        <div class="form-group pull-left">
                            <button type="submit" disabled={this.isInvalid()} class="thm-btn thm-tran-bg">Login</button>
                        </div>
                        <div class="form-group social-links-two padd-top-5 pull-right">
                            Or login with
                            <a href="#" class="img-circle facebook"><span class="fa fa-facebook-f"></span></a>
                            <a href="#" class="img-circle google-plus"><span class="fa fa-google"></span></a>
                        </div>
                    </div>
                </form>
            </div >
        );
    }

    //checks if the login info is invalid, if so, the submit button will be disabled
    isInvalid() {
        const { password, email } = this.state;
        return (password === '' || email === '');
    }
    //updates the state when form elements are changed
    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: null
        });
    };

    onSubmit(event) {
        const { email, password } = this.state;
        //firebase prop comes from the withFirebase higher component
        this.props.firebase
          .signInWithEmailAndPassword(email, password)
          .then(authUser => {
            console.log(authUser);
            /**@TODO take uid and email from authUser maybe sessionID and post to the backend */
            this.setState({ ...INITIAL_STATE }); //reset the login boxes
            this.props.history.push('/profile'); //from with router, pushing to history routes the user to the pushed route
          })
          .catch(error => {
            this.setState({ error });
          });
    
        event.preventDefault();
    };
}

//composes the login form by using higher order components to make it have routing and firebase capabilities
const LoginForm = compose(
    withRouter,
    withFirebase
)(LoginFormBase);

export default LoginFormBase;
export{ LoginForm };


