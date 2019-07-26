import React from 'react';
import URLS from '../../../api/urls'
import { postJson } from '../../../api/functions';

/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/
const INITIAL_STATE = {
    title: '',
    body: '',
    message: 'Add your own story'
};

class StoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (
            <div className="review-form">
                <div className="tab-title-h4">
                    <h4>{this.state.message}</h4>
                </div>
                <form onSubmit={this.onSubmit}>
                    <div className="field-label">
                        <p>Story Title*</p>
                        <input type="text" name="fname" name="title" value={this.state.title} onChange={this.onChange} required/>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="field-label">
                                <p>Your Story*</p>
                                <textarea name="review" name="body" value={this.state.body} onChange={this.onChange} required></textarea>
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

    onSubmit(event) {
        event.preventDefault();
        /** Collects the form data and sends it to the backend */
        const body = {
            "user": this.props.uid,
            "action": this.props.aid,
            "rank": 0,
            "body": this.state.body,
            "title": this.state.title,
        }
        postJson(URLS.TESTIMONIALS, body).then(json => {
            console.log(json);
            if(json.success){
                this.setState({
                    ...INITIAL_STATE,
                    message: "Thank you for submitting your story!"
                })
                this.props.addStory(json.data);
            }else{
                this.setState({
                    ...INITIAL_STATE,
                    message: "We are sorry, but you can only submit one story about this Action"
                })
            }

        })
    }
}

//composes the login form by using higher order components to make it have routing and firebase capabilities
export default StoryForm;


