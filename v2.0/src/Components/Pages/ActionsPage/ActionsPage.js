import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import URLS from '../../../api/urls';
import { apiCall, postJson } from '../../../api/functions'
import { reduxAddToDone, reduxAddToTodo, reduxMoveToDone } from '../../../redux/actions/userActions'
import { reduxChangeData, reduxTeamAddAction } from '../../../redux/actions/pageActions'
import BreadCrumbBar from '../../Shared/BreadCrumbBar';
import SideBar from '../../Menu/SideBar';
import Action from './Action';
import Cart from '../../Shared/Cart';
import PageTitle from '../../Shared/PageTitle';
import Error404 from './../Errors/404';


/**
 * The Actions Page renders all the actions and a sidebar with action filters
 * @props none - fetch data from api instead of getting data passed to you from props
 * 
 * @todo change the columns for small sizes change button colors bars underneath difficulty and ease instead of "easy, medium, hard"
 */
class ActionsPage extends React.Component {
	constructor(props) {
		super(props);
		this.handleSearch = this.handleSearch.bind(this);
		this.state = {
			loaded: false,
			openAddForm: null,
			testimonialLink: null,
			mirror_actions:[]
		}
		this.handleChange = this.handleChange.bind(this);
	}
	render() {
		if (!this.props.homePageData) return <p className='text-center'> <Error404 /></p>;
		
		const actions = this.state.mirror_actions.length >0 ? this.state.mirror_actions : this.props.actions;
		return (
			<>
				 
				<div className="boxed_wrapper" >
				<BreadCrumbBar links={[{ name: 'All Actions' }]} />
			
					{/* main shop section */}
					<div className="shop sec-padd">
						<div className="container">
							<div className="row">
								{/* renders the sidebar */}
								<div className="col-lg-3 col-md-5 col-sm-12 col-xs-12 sidebar_styleTwo" style={{paddingTop:60}}>
									<SideBar
										search ={this.handleSearch}
										foundNumber={this.state.mirror_actions.length}
										tagCols={this.props.tagCols}
										onChange={this.handleChange} //runs when any category is selected or unselected
									></SideBar>
									{this.props.user ?
										<div>
											{this.props.todo ?
												<Cart title="To Do List" actionRels={this.props.todo} status="TODO" /> : null}
											{this.props.done ?
												<Cart title="Completed Actions" actionRels={this.props.done} status="DONE" /> : null}
										</div>
										:
										<div>
											<p>
												<Link to={`${this.props.links.signin}`}> Sign In </Link> to add actions to your todo list or to mark them as complete
                                        </p>
										</div>
									}
								</div>
								{/* renders the actions */}
								<div className="col-lg-9 col-md-7 col-sm-12 col-xs-12">
								<PageTitle>Actions</PageTitle>
									<div className="row" id="actions-container"  style={{ marginTop:10,paddingRight:40 }}>
										{this.renderActions(actions)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
	// on change in any category or tag checkbox update the actionsPage
	handleChange() {
		this.forceUpdate();
	}
	handleSearch = event => {
		const value = event.target.value;
		const actions = this.props.actions;
		const common = [];
		if (value.trim() !== "") {
			for (let i = 0; i < actions.length; i++) {
				const ac = actions[i];
				if (ac.title.toLowerCase().includes(value.toLowerCase())) {
					common.push(ac);
				}
			}
			this.setState({ mirror_actions: [...common] });
		}else{
			this.setState({mirror_actions:[]})
		}
	}
	// renders all the actions
	renderActions(actions) {  
		if (!actions || actions.length === 0) {
			return <p>There aren't any actions available in this community yet, come back later.</p>;
		}
		//returns a list of action components
		return Object.keys(actions).reverse().map(key => {
			var action = actions[key];
			return <Action key={key}
				action={action}
				tagCols={this.props.tagCols}
				match={this.props.match} //passed from the Route, need to forward to the action for url matching
				user={this.props.user}
				addToCart={(aid, hid, status) => this.addToCart(aid, hid, status)}
				inCart={(aid, hid, cart) => this.inCart(aid, hid, cart)}
				moveToDone={(aid, hid) => this.moveToDoneByActionId(aid, hid)}
				HHFormOpen={this.state.openAddForm === action.id}
				showTestimonialLink={this.state.testimonialLink === action.id}
				closeHHForm={() => this.setState({ openAddForm: null })}
				openHHForm={(aid) => this.setState({ openAddForm: aid })}
			/>
		});
	}

	/**
	 * These are the cart functions
	 */
	inCart = (aid, hid, cart) => {
		if (!this.props.todo) return false;
		const checkTodo = this.props.todo.filter(actionRel => { return Number(actionRel.action.id) === Number(aid) && Number(actionRel.real_estate_unit.id) === Number(hid) });
		if (cart === "TODO") { return checkTodo.length > 0; }

		if (!this.props.done) return false;
		const checkDone = this.props.done.filter(actionRel => { return Number(actionRel.action.id) === Number(aid) && Number(actionRel.real_estate_unit.id) === Number(hid) });
		if (cart === "DONE") return checkDone.length > 0;

		return checkTodo.length > 0 || checkDone.length > 0;
	}
	moveToDone = (actionRel) => {
		const body = {
			user_id: this.props.user.id,
			action_id: actionRel.action.id,
			household_id: actionRel.real_estate_unit.id,
		}
		apiCall('users.actions.completed.add', body).then(json => {
			if (json.success) {
				this.props.reduxMoveToDone(json.data);
				// this.addToImpact(json.data.action);
				this.setState({ testimonialLink: actionRel.action.id })
			} else{
				console.log(json.error)
			}
			//just update the state here
		}).catch(err => {
			console.log(err)
		})
	}
	moveToDoneByActionId(aid, hid) {
		const actionRel = this.props.todo.filter(actionRel => {
			return Number(actionRel.action.id) === Number(aid) && Number(actionRel.real_estate_unit.id) === Number(hid)
		})[0];
		if (actionRel)
			this.moveToDone(actionRel);

	}
	addToCart = (aid, hid, status) => {
		const body = {
			user_id: this.props.user.id,
			action_id: aid,
			household_id: hid,
		}
		const path = (status === "DONE") ? "users.actions.completed.add" : "users.actions.todo.add"
		this.setState({ testimonialLink: null });
		apiCall(path, body).then(json => {
			if (json.success) {
				//set the state here
				if (status === "TODO") {
					this.props.reduxAddToTodo(json.data);
				}
				else if (status === "DONE") {
					this.props.reduxAddToDone(json.data);
					// this.addToImpact(json.data.action);
					this.setState({ testimonialLink: aid });
				}
			}
		}).catch(error => {
			console.log(error);
		});
	}

	addToImpact(action) {
		this.changeDataByName("ActionsCompletedData", 1)
		action.tags.forEach(tag => {
			if (tag.tag_collection && tag.tag_collection.name === "Category") {
				this.changeData(tag.id, 1);
			}
		});
		Object.keys(this.props.user.teams).forEach(key => {
			this.props.reduxTeamAddAction(this.props.user.teams[key]);
		})
	}

	changeDataByName(name, number) {
		const communityData = this.props.communityData || []
		var data = communityData.filter(data => {
			return data.name === name
		})[0];

		const body = {
			"value": data.value + number > 0 ? data.value + number : 0
		}
		postJson(URLS.DATA + '/' + data.id, body).then(json => {
			if (json.success) {
				data = {
					...data,
					value: data.value + number > 0 ? data.value + number : 0
				}
				this.props.reduxChangeData(data);
			}
		})
	}

	changeData(tagid, number) {
		var data = this.props.communityData.filter(data => {
			if (data.tag) {
				return data.tag === tagid;
			}
			return false;
		})[0];
		if (!data) {
			return;
		}
		const body = {
			"value": data.value + number > 0 ? data.value + number : 0
		}
		postJson(URLS.DATA + '/' + data.id, body).then(json => {
			if (json.success) {
				data = {
					...data,
					value: data.value + number > 0 ? data.value + number : 0
				}
				this.props.reduxChangeData(data);
			}
		})
	}
}
const mapStoreToProps = (store) => {
	return {
		homePageData: store.page.homePage,
		auth: store.firebase.auth,
		user: store.user.info,
		todo: store.user.todo,
		done: store.user.done,
		actions: store.page.actions,
		tagCols: store.page.tagCols,
		pageData: store.page.actionsPage,
		communityData: store.page.communityData,
		links: store.links
	}
}

const mapDispatchToProps = {
	reduxAddToDone,
	reduxAddToTodo,
	reduxMoveToDone,
	reduxChangeData,
	reduxTeamAddAction
}
export default connect(mapStoreToProps, mapDispatchToProps)(ActionsPage);
