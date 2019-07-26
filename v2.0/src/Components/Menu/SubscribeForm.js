import React from 'react';
import URLS from '../../api/urls'
import { postJson } from '../../api/functions';

/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/
const INITIAL_STATE = {
    email: '',
    name: '',
    message: 'Your mail id is confidential'
};

class SubscribeForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (
            <div className="footer-widget contact-column text-center text-md-left">
                <div className="section-title">
                    <b className="text-white">Subscribe to Newsletter</b>
                </div>
                <form onSubmit={this.onSubmit}>
                    <input className="text-white"
                        type="text"
                        placeholder="Name..."
                        name="name"
                        value={this.state.name}
                        onChange={this.onChange}
                        required
                    />
                    <input className="text-white"
                        type="email"
                        placeholder="Email address..."
                        name="email"
                        value={this.state.email}
                        onChange={this.onChange}
                        required
                    />
                    <button type="submit"><i className="fa fa-paper-plane"></i></button>
                </form>
                <p>{this.state.message}</p>
            </div>
        );
    }

    //updates the state when form elements are changed
    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: null
        });
    };

    onSubmit(event) {
        event.preventDefault();
        /** Collects the form data and sends it to the backend */
        const body = {
            "email": this.state.email,
            "name": this.state.name,
            "community": 1,
        }
        postJson(URLS.SUBSCRIBERS, body).then(json => {
            console.log(json);
            if (json.success) {
                this.setState({ ...INITIAL_STATE, message: `Success! ${this.state.email} is now subscribed to our Community's Newsletter` });
            } else {
                var known = false;
                json.errors.forEach(error => {
                    if (error.includes("duplicate")) {
                        this.setState({ ...INITIAL_STATE, message: `${this.state.email} is already subscribed to our Community's Newsletter` });
                        known = true;
                    }
                })
                if (!known)
                    this.setState({ ...INITIAL_STATE, message: 'unknown error while subscribing' });
            }
        })
    }
}

//composes the login form by using higher order components to make it have routing and firebase capabilities
export default SubscribeForm;


