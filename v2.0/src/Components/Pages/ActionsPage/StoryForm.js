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
    aid: '--',
    vid: '--',
    vendor: '',
    message: 'Already completed an action? Tell Us Your Story',
    limit: 9000,
};

class StoryForm extends React.Component {
    constructor(props) {
        super(props);
        var message = 'Already completed an action? Tell Us Your Story';
        if(props.aid) message = 'Already completed this action? Tell Us Your Story';
        if(props.vid) message = 'Already used this vendor? Tell Us Your Story';

        this.state = {
            ...INITIAL_STATE,
            vid: props.vid? props.vid : '--',
            aid: props.aid? props.aid : '--',

            message: message
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    render() {
        if (!this.props.actions || this.props.actions.length === 0) return <p> Sorry, there are no actions to submit a story about </p>;
        if (this.state.vid !== 'other' && this.state.vendor !== '') this.setState({ vendor: '' })
        return (
            <div className="review-form" style={{ border: '1px solid #aaa' }}>
                <div className="tab-title-h4 text center">
                    <h4>{this.state.message}</h4>
                </div>
                <form onSubmit={this.onSubmit} style={{ margin: '20px' }} >
                    {this.props.aid ? null :
                        <>
                            <p> Which action is this testimonial about? </p>
                            <select value={this.state.aid} onChange={event => this.setState({ aid: event.target.value })}>
                                <option value={'--'}>--</option>
                                {this.renderOptions(this.props.actions)}
                            </select>
                            <br />
                        </>
                    }
                    {this.props.vid ? null :
                        <>
                            <p> Who helped you complete this action? </p>
                            <select value={this.state.vid} onChange={event => this.setState({ vid: event.target.value })}>
                                <option value={'--'}>Did it myself!</option>
                                {this.renderOptions(this.props.vendors)}
                                <option value={'other'}>Other</option>
                            </select> &nbsp; &nbsp; &nbsp;
                            {this.state.vid === 'other' ?
                                <div className="field-label" style={{ display: 'inline-block' }}>
                                    <input type="text" name="vendor" value={this.state.vendor} onChange={this.onChange} autoFocus={true} required />
                                </div> : <br />
                            }
                        </>
                    }
                    <div className="field-label">
                        <p>Story Title*</p>
                        <input type="text" name="title" value={this.state.title} onChange={this.onChange} required />
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="field-label">
                                <p style={{ display: 'inline-block', float: 'left' }}>Your Story*</p>
                                <p
                                    className={this.state.body.length > this.state.limit ? "text-danger" : null}
                                    style={{ display: 'inline-block', float: 'right' }}
                                >
                                    {this.state.body.length + ' / ' + this.state.limit + 'chars'}
                                </p>
                                <textarea name="body" value={this.state.body} onChange={this.onChange} style={{ width: '100%' }} required>

                                </textarea>

                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <button className="thm-btn bg-cl-1" type="submit">Submit Now</button>
                        </div>
                    </div>
                    {this.state.error ? <p className='text-danger'>{this.state.error}</p> : null}

                </form>
            </div>
        );
    }
    count = (words) => {
        // return words.split(' ').length //word count
        return words.length; //char count
    }
    //updates the state when form elements are changed
    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: null
        });
    };
    renderOptions(choices) {
        return Object.keys(choices).map(key => {
            var choice = choices[key];
            return <option value={choice.id}> {choice.title ? choice.title : choice.name} </option>
        })
    }
    onSubmit(event) {
        console.log(this.state);
        event.preventDefault();
        /** Collects the form data and sends it to the backend */
        const body = {
            "user": this.props.user.id,
            "vendor": this.state.vid !== '--' && this.state.vid !== 'other' ? this.state.vid : null,
            "action": this.props.aid ? this.props.aid : this.state.aid,
            "rank": 0,
            "body": this.state.body,
            "title": this.state.title,
            "community": this.props.community.id
        }
        if (!this.props.aid && (!this.state.aid || this.state.aid === '--')) {
            this.setState({ error: "Please choose which action you are writing a testimonial about" })
        } else if (this.count(this.state.body) > this.state.limit) {
            this.setState({ error: "Sorry, your story is too long" })
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
                        error: "We are sorry, but you can only submit one story about this Action"
                    })
                }
                console.log(this.state);
            })
        }
    }
}

const mapStoreToProps = (store) => {
    return {
        user: store.user.info,
        actions: store.page.actions,
        vendors: store.page.serviceProviders,
        community: store.page.community
    }
}
//composes the login form by using higher order components to make it have routing and firebase capabilities
export default connect(mapStoreToProps)(StoryForm);


