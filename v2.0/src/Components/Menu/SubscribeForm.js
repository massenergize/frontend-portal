import React from 'react';
import { apiCall } from '../../api/functions';
import { connect } from 'react-redux'

/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/
const INITIAL_STATE = {
    email: '',
    name: '',
    message: 'Your name and email are confidential and intended solely for sending you our Newsletter'
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
                <p className="cool-font" >{this.state.message}</p>
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
            "community": this.props.community? this.props.community.id : null,
        }
        apiCall('subscribers.add', body).then(json => {
            if (json.success) {
                this.setState({ ...INITIAL_STATE, message: `Success! ${this.state.email} is now subscribed to our Community's Newsletter` });
            } else {
                var known = false;
                if (json.error.includes("duplicate")) {
                    this.setState({ ...INITIAL_STATE, message: `${this.state.email} is already subscribed to our Community's Newsletter` });
                    known = true;
                }
                if (!known)
                    this.setState({ ...INITIAL_STATE, message: 'unknown error while subscribing' });
            }
        })
    }
}

const mapStoreToProps = (store) => {
    return {
        community: store.page.community,
    }
}
//composes the login form by using higher order components to make it have routing and firebase capabilities
export default  connect(mapStoreToProps)(SubscribeForm);


