import React from 'react';
import { apiCall } from '../../../api/functions';
import { connect } from 'react-redux';
import defaultUser from './../../Shared/default-user.png';

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
		if (props.aid) message = 'Already completed this action? Tell Us Your Story';
		if (props.vid) message = 'Already used this vendor? Tell Us Your Story';

		this.state = {
			...INITIAL_STATE,
			vid: props.vid ? props.vid : '--',
			aid: props.aid ? props.aid : '--',
			captchaConfirmed: false,
			message: message,
			picFile: null,
			selected_tags: [],
			anonymous:false,
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	categories() {
		const cat = this.props.tagCollections;
		if (cat) {
			return cat.filter(item => item.name === "Category")[0];
		}
		return null;
	}
	ejectCategories() {
		if (this.categories()) {
			return this.categories().tags.map(cat => <option>{cat.name}</option>)
		}
	}

	ejectSelectedTags() {
		return this.state.selected_tags.map((item, key) => {
			return (
				<small onClick={() => { this.removeTag(item.id) }} key={key.toString()} className="sm-tag-hover" style={{ cursor: 'pointer', border: 'solid 1px #f5f4f4', color: '#888', borderRadius: 55, margin: 5, padding: '5px 40px' }}> {item.name} <i style={{ marginLeft: 5 }} className="fa fa-close " /></small>
			)
		})
	}

	removeTag(id) {
		const old = this.state.selected_tags;
		const newOne = old.filter(item => item.id !== id);
		this.setState({ selected_tags: newOne })
	}

	handleTagChoice(event) {
		const cats = this.categories().tags;
		const old = this.state.selected_tags;
		if (cats) {
			let found = cats.filter(item => item.name === event.target.value)[0];
			if (!old.includes(found)) {
				this.setState({ selected_tags: [...old, found] });
			}
		}
	}
	check(type){
		//if true then make me anonymous
		console.log("I have been clicked")
		if(type){
			this.setState({anonymous:true}); 
			document.getElementById('real_name').checked = false;
			document.getElementById('ano').checked = true;
		}
		else{
			this.setState({anonymous:false});
			document.getElementById('ano').checked = false;
			document.getElementById('real_name').checked = true;
		}
	}
	render() {
		const cols = this.props.tagCollections;
		if (!this.props.actions || this.props.actions.length === 0) return <div className='text-center'><p> Sorry, there are no actions to submit a story about </p></div>;
		if (this.state.vid !== 'other' && this.state.vendor !== '') this.setState({ vendor: '' })
		return (
			<div className="review-form " style={{ border: '1px solid lightgray', borderRadius: 10, padding: 25 }}>
				{this.props.noMessage ? null :
					<div className="tab-title-h4 text center">
						<h4 className="p-2">{this.state.message}</h4>
					</div>
				}
				<form onSubmit={this.onSubmit} style={{ margin: '20px' }} >
					{this.props.aid ? null :
						<>
							<p> Which action is this testimonial about? </p>
							<div className="combo-box-wrapper">
								<select className="w-100 select-undefault " value={this.state.aid} onChange={event => this.setState({ aid: event.target.value })}>
									<option value={'--'}>--</option>
									{this.renderOptions(this.props.actions)}
								</select>
							</div>
							<br />
						</>
					}
					{/* <div>
						<p>How would you like  your name to be displayed? </p>
						<input  type="checkbox" id = "real_name"value="false" style={{display:'inline-block'}} onClick ={()=>{this.check(false)}}/>	<small onClick ={()=>{this.check(false)}} style={{ fontSize:15, fontWeight:'600' , cursor:'pointer'}}>'John Doe'</small> <br/>
						<input  type="checkbox" id="ano" value = "true" style={{display:'inline-block'}} onClick ={()=>{this.check(true)}}/>	<small onClick ={()=>{this.check(true)}} style={{ fontSize:15, fontWeight:'600' , cursor:'pointer'}}>Anonymous</small>
					</div> */}
					{this.props.vid ? null :
						<>
							<p> Who helped you complete this action? </p>
							<div className="combo-box-wrapper">
								<select className="w-100 select-undefault" value={this.state.vid} onChange={event => this.setState({ vid: event.target.value })}>
									<option value={'--'}>Did it myself!</option>
									{this.renderOptions(this.props.vendors)}
									<option value={'other'}>Other</option>
								</select></div> &nbsp; &nbsp; &nbsp;
                            {this.state.vid === 'other' ?
								<div className="field-label" style={{ display: 'inline-block' }}>
									<input type="text" name="vendor" value={this.state.vendor} onChange={this.onChange} autoFocus={true} required />
								</div> : <br />
							}
						</>
					}

					{cols ?
						<>
							<p style={{ marginBottom: 4 }}> Choose all the categories this testimonial belongs to. </p>
							{this.ejectSelectedTags()}
							<div className="combo-box-wrapper" style={{ marginTop: 15 }}>
								<select className="w-100 select-undefault" onChange={(event) => { this.handleTagChoice(event) }}>
									<option>--</option>
									{this.ejectCategories()}
								</select><br />
							</div>
						</>
						: <br />}
					<div className="field-label">
						<p>Story Title*</p>
						<input type="text" style={{ borderRadius: 5 }} name="title" value={this.state.title} onChange={this.onChange} required />
					</div>
					<div className="row">
						<div className="col-md-12 " style={{ padding: 10, border: 'solid 1px #f5f3f3', borderRadius: 10 }}>
							<p style={{ margin: 15 }}>Upload an image</p>
							<input type="file" name="image" onChange={(event) => { this.setState({ picFile: event.target.value }) }} classname="form-control" />
						</div>
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
								<textarea name="body" value={this.state.body} onChange={this.onChange} style={{ width: '100%', borderColor: 'lightgray', borderRadius: 6 }} required>

								</textarea>

							</div>
						</div>
					</div>
					<br></br>
					<div className="row">
						<div className="col-md-12">
							<button className="thm-btn bg-cl-1 btn-finishing" type="submit">Submit Now</button>
						</div>
					</div>
					{this.state.message ? <p className='text-success'>{this.state.message}</p> : null}
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
		event.preventDefault();
		/** Collects the form data and sends it to the backend */
		const body = {
			"user_email": this.props.user.email,
			"vendor_id": this.state.vid !== '--' && this.state.vid !== 'other' ? this.state.vid : null,
			"action_id": this.props.aid ? this.props.aid : this.state.aid === "--" ? null : this.state.aid,
			"rank": 0,
			"body": this.state.body,
			"title": this.state.title,
			"community_id": this.props.community.id,
			"image": this.state.picFile ? this.state.picFile : defaultUser,
			"tags": this.state.selected_tags ? this.state.selected_tags : null, 
			// 'anonymous': this.state.anonymous
		}
		// if (!this.props.aid && (!this.state.aid || this.state.aid === '--')) {
		// 	this.setState({ error: "Please choose which action you are writing a testimonial about" })
		if (this.count(this.state.body) > this.state.limit) {
			this.setState({ error: "Sorry, your story is too long" })
		} else {
			//postJson(URLS.TESTIMONIALS, body).then(json => {
			apiCall(`testimonials.add`, body).then(json => {
				console.log(json);
				if (json && json.success) {
					this.setState({
						...INITIAL_STATE,
						message: "Thank you for submitting your story! Our community admins will review it and post it soon."
					})
					if (this.props.closeForm) this.props.closeForm('Thank you for submitting your testimonial. Your community admins will review it and post it soon.');
				} else {
					this.setState({
						...INITIAL_STATE,
						error: "There was an error submitting your testimonial"
					})
					if (this.props.closeForm) this.props.closeForm('There was an error submitting your testimonial. We are sorry.');
				}
			})
		}
	}
}

const mapStoreToProps = (store) => {
	return {
		user: store.user.info,
		actions: store.page.actions,
		vendors: store.page.serviceProviders,
		community: store.page.community,
		tagCollections: store.page.tagCols
	}
}
//composes the login form by using higher order components to make it have routing and firebase capabilities
export default connect(mapStoreToProps)(StoryForm);


