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
			email: props.email ? props.email : '',
			delete_account: false,
			change_password: false,
			are_you_sure: false,
		};

		this.onChange = this.onChange.bind(this);
	}

	render() {
		return (
			<form onSubmit={this.onSubmit}>
				
				<div className="z-depth-1" style={{border:'solid 1px 1px solid rgb(243, 243, 243)', borderRadius:10,padding:30}}>
				<h5>Edit Your Profile</h5>
					{this.state.error ?
						<p className='text-danger'>{this.state.error}</p> : null
					}
					<input type="text" className="form-control" name="full_name" value={this.state.full_name} onChange={this.onChange} required />
					<small>Full Name <span className="text-danger" >*</span></small>
					<input type="email" className="form-control" name="email" value={this.state.email} onChange={this.onChange} required readonly="true"/>
					<small>Email ( Not Editable ) <span className="text-default" >*</span></small>

					<input type="text" className="form-control" name="preferred_name" value={this.state.preferred_name} onChange={this.onChange} required />
					<small>Preferred Name <span className="text-danger">*</span></small>
					<br/>
					<button className="thm-btn bg-cl-1" type="submit">{"Submit"}</button>
					<button className="thm-btn red" type='button' onClick={() => this.props.closeForm()}> Cancel </button>
				</div>
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
	deleteAccount() {
		this.setState({ error: "Sorry, we don't support deleting profiles yet" });
	}
}


const mapStoreToProps = store => {
	return {
		user: store.user.info,
		auth: store.firebase.auth
	}
}
export default connect(mapStoreToProps, { reduxLogin })(EditingProfileForm);


