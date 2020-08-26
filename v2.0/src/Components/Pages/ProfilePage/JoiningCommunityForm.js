import React from 'react';
import { apiCall } from '../../../api/functions'
import { connect } from 'react-redux'
import { reduxLoadUserCommunities } from '../../../redux/actions/userActions'

class JoiningCommunityForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: '--'
		};

		this.onChange = this.onChange.bind(this);
	}

	render() {
		return (
			<>
				<h6 style={{ display: 'inline-block' }}> Community </h6>
				&nbsp;
                <select value={this.state.value}className='form-control' onChange={this.onChange}>
					<option value='--'>--</option>
					{Object.keys(this.props.communities).map(key => {
						const community = this.props.communities[key];
						if (this.props.user.communities.filter(com => { return com.id === community.id }).length === 0)
							return <option key={key} value={community.id}>{community.name}</option>
						return null;
					})}
				</select>
				<button className='thm-btn' style={{ width: '99%',padding:8 }} onClick={this.onSubmit}>Join</button>
				<button className="" style={{ color:'white',width: '99%',padding:13,borderRadius:6,background:'indianred',borderColor:'indianred' }} onClick={this.props.closeForm}>Cancel</button>
			</>
		);
	}

	//updates the state when form elements are changed
	onChange(event) {
		this.setState({
			value: event.target.value,
		});
	};

	onSubmit = () => {
		if (this.state.value !== '--') {
			const body = {
				user_id: this.props.user.id,
				community_id: this.state.value
			}

			/** Collects the form data and sends it to the backend */
			apiCall('communities.join', body).then(json => {
				if (json.success) {
					this.props.reduxLoadUserCommunities(json.data.communities);
					this.props.closeForm();
				}
			}).catch(error => {
				console.log(error);
			})
		}
	}
}


const mapStoreToProps = store => {
	return {
		communities: store.page.communities,
		user: store.user.info
	}
}
const mapDispatchToProps = { reduxLoadUserCommunities }
//composes the login form by using higher order components to make it have routing and firebase capabilities
export default connect(mapStoreToProps, mapDispatchToProps)(JoiningCommunityForm);


