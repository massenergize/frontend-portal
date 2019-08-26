import React from 'react';
import URLS from '../../../api/urls'
import { postJson } from '../../../api/functions';
import { connect } from 'react-redux';

/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/
const INITIAL_STATE = {
    title: '',
    body: '',
    aid: null,
    message: 'Already completed an action? Tell Us Your Story'
};

class StoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            ...INITIAL_STATE,
            message: props.aid? 'Already completed this action? Tell Us Your Story' : 'Already completed an action? Tell Us Your Story'
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        if (!this.props.actions || this.props.actions.length === 0) return <p> Sorry, there are no actions to submit a story about </p>;
        return (
            <div className="review-form" style={{border:'1px solid #aaa'}}>
                <div className="tab-title-h4 text center">
                    <h4>{this.state.message}</h4>
                </div>
                <form onSubmit={this.onSubmit} style={{margin:'20px'}} >
                    {this.props.aid ? null :
                        <>
                            <p> Which action is this testimonial about? </p>
                            {this.state.error ? <p className='text-danger'>{this.state.error}</p> : null}
                            <select value={this.state.aid} onChange={event => this.setState({ aid: event.target.value })}>
                                <option value={null}>--</option>
                                {this.renderActionOptions(this.props.actions)}
                            </select>
                            <br />
                        </>
                    }
                    <div className="field-label">
                        <p>Story Title*</p>
                        <input type="text" name="title" value={this.state.title} onChange={this.onChange} required />
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="field-label">
                                <p>Your Story*</p>
                                <textarea name="body" value={this.state.body} onChange={this.onChange} style={{width:'100%'}} required></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <button className="thm-btn bg-cl-1" type="submit">Submit Now</button>
                        </div>
                    </div>
                </form>
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
    renderActionOptions(actions) {
        return Object.keys(actions).map(key => {
            var action = actions[key];
            return <option value={action.id}> {action.title} </option>
        })
    }
    onSubmit(event) {
        console.log(this.state);
        event.preventDefault();
        /** Collects the form data and sends it to the backend */
        const body = {
            "user": this.props.uid,
            "action": this.props.aid ? this.props.aid : this.state.aid,
            "rank": 0,
            "body": this.state.body,
            "title": this.state.title,
            "community": this.props.community.id
        }
        if (!this.props.aid && !this.state.aid) {
            this.setState({ error: "Please choose which action you are writing a testimonial about" })
        } else {
            postJson(URLS.TESTIMONIALS, body).then(json => {
                console.log(json);
                if (json.success) {
                    this.setState({
                        ...INITIAL_STATE,
                        message: "Thank you for submitting your story! Our community admins will review it and post it soon."
                    })
                } else {
                    this.setState({
                        ...INITIAL_STATE,
                        message: "We are sorry, but you can only submit one story about this Action"
                    })
                }
                console.log(this.state);
            })
        }
    }
}

const mapStoreToProps = (store) => {
    return {
        actions: store.page.actions,
        community: store.page.community
    }
}
//composes the login form by using higher order components to make it have routing and firebase capabilities
export default connect(mapStoreToProps)(StoryForm);


