import React from 'react';
import { connect } from 'react-redux'
import { reduxLogin } from '../../../redux/actions/userActions'
import URLS from '../../../api/urls'
import { postJson } from '../../../api/functions'


/********************************************************************/
/**                        SUBSCRIBE FORM                          **/
/********************************************************************/


class EditingProfileForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            full_name: props.full_name ? props.full_name : '',
            preferred_name: props.preferred_name ? props.preferred_name : '',
            delete_account: false,
            are_you_sure: false,
        };

        this.onChange = this.onChange.bind(this);
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                {this.state.error? 
                <p className='text-danger'>{this.state.error}</p> : null
            }
                <input type="text" name="full_name" value={this.state.full_name} onChange={this.onChange} required />
                <p>Full Name <span className="text-danger" >*</span></p>

                <input type="text" name="preferred_name" value={this.state.preferred_name} onChange={this.onChange} required />
                <p>Preffered Name <span className="text-danger">*</span></p>


                <input
                    type="checkbox"
                    id="delete_account"
                    checked={this.state.deleteAccount}
                    onChange={() => this.setState({ delete_account: !this.state.delete_account })}
                    style={{ display: "inline-block" }}
                />
                <label htmlFor="delete_account" style={{ display: "inline-block" }}> Delete Account</label>
                <br />
                {this.state.delete_account ?
                    <>
                        <p> Are you sure you want to delete your account? </p>

                        <input
                            type="radio"
                            id="yes_im_sure"
                            checked={this.state.are_you_sure}
                            onChange={() => this.setState({ are_you_sure: !this.state.are_you_sure })}
                            style={{ display: "inline-block" }}
                        />
                        <label htmlFor="yes_im_sure" style={{ display: "inline-block" }}> Yes </label>
                        &nbsp;
                        <input
                            type="radio"
                            id="nope_not_sure"
                            checked={!this.state.are_you_sure}
                            onChange={() => this.setState({ are_you_sure: !this.state.are_you_sure })}
                            style={{ display: "inline-block" }}
                        />
                        <label htmlFor="nope_not_sure" style={{ display: "inline-block" }}> No</label>
                        <br />
                    </> : null
                }
                <button className="thm-btn bg-cl-1" type="submit">{"Submit"}</button>
                <button className="thm-btn red" type='button' onClick={this.props.closeForm}> Cancel </button>
            </form>
        );
    }

    //updates the state when form elements are changed
    onChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: null
        });
        console.log(this.state.unittype)
    };

    onSubmit = (event) => {
        event.preventDefault();
        if (this.state.delete_account && this.state.are_you_sure) {
            this.deleteAccount();
        } else {
            const body = {
                "full_name": this.state.full_name,
                "preferred_name": this.state.preferred_name,
            }
            var postURL = URLS.USER + "/" + this.props.user.id;
            /** Collects the form data and sends it to the backend */
            postJson(postURL, body).then(json => {
                console.log(json);
                if (json.success && json.data) {
                    this.props.reduxLogin(json.data);
                    this.props.closeForm();
                }
            }).catch(error => {
                console.log(error);
            })
        }
    }
    deleteAccount(){
        this.setState({error: "Sorry, we don't support deleting accounts yet"});
    }
}


const mapStoreToProps = store => {
    return {
        user: store.user.info
    }
}
export default connect(mapStoreToProps, { reduxLogin })(EditingProfileForm);


