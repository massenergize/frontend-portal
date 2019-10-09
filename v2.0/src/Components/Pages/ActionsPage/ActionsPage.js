import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import URLS from '../../../api/urls';
import { getJson, postJson } from '../../../api/functions'
import { reduxAddToDone, reduxAddToTodo, reduxMoveToDone } from '../../../redux/actions/userActions'
import { reduxChangeData, reduxTeamAddAction } from '../../../redux/actions/pageActions'
import BreadCrumbBar from '../../Shared/BreadCrumbBar';
import SideBar from '../../Menu/SideBar';
import Action from './Action';
import Cart from '../../Shared/Cart';



/**
 * The Actions Page renders all the actions and a sidebar with action filters
 * @props none - fetch data from api instead of getting data passed to you from props
 * 
 * @todo change the columns for small sizes change button colors bars underneath difficulty and ease instead of "easy, medium, hard"
 */
class ActionsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,
			openAddForm: null,
			testimonialLink: null,
		}
		this.handleChange = this.handleChange.bind(this);
	}
	render() {
		return (
			<>
				
				<div className="boxed_wrapper" >
				<BreadCrumbBar links={[{ name: 'All Actions' }]} />
					{/* main shop section */}
					<div className="shop sec-padd">
						<div className="container">
							<div className="row">
								{/* renders the sidebar */}
								<div className="col-lg-3 col-md-5 col-sm-12 col-xs-12 sidebar_styleTwo">
									<SideBar
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
									<div className="row" id="actions-container">
										{this.renderActions(this.props.actions)}
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
	// renders all the actions
	renderActions(actions) { 
		if (!actions || actions.length === 0) {
			return <p>There are not any actions available in this community yet, come back later.</p>;
		}
		//returns a list of action components
		return Object.keys(actions).map(key => {
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
			status: "DONE",
			action: actionRel.action.id,
			real_estate_unit: actionRel.real_estate_unit.id,
		}
		postJson(URLS.USER + '/' + this.props.user.id + '/action/' + actionRel.id, body).then(json => {
			console.log(json);
			if (json.success) {
				this.props.reduxMoveToDone(json.data);
				this.addToImpact(json.data.action);
				this.setState({ testimonialLink: actionRel.action.id })
			}
			//just update the state here
		}).catch(err => {
			console.log(err)
		})
	}
	moveToDoneByActionId(aid, hid) {
		console.log(aid + " " + hid)
		const actionRel = this.props.todo.filter(actionRel => {
			return Number(actionRel.action.id) === Number(aid) && Number(actionRel.real_estate_unit.id) === Number(hid)
		})[0];
		console.log(actionRel);
		if (actionRel)
			this.moveToDone(actionRel);

	}
	addToCart = (aid, hid, status) => {
		const body = {
			action: aid,
			status: status,
			real_estate_unit: hid
		}
		this.setState({ testimonialLink: null });
		console.log(this.props.user.id)
		postJson(URLS.USER + "/" + this.props.user.id + "/actions", body).then(json => {
			console.log(json)
			if (json.success) {
				//set the state here
				if (status === "TODO") {
					this.props.reduxAddToTodo(json.data);
				}
				else if (status === "DONE") {
					this.props.reduxAddToDone(json.data);
					this.addToImpact(json.data.action);
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
		var data = this.props.communityData.filter(data => {
			return data.name === name
		})[0];

		const body = {
			"value": data.value + number > 0 ? data.value + number : 0
		}
		postJson(URLS.DATA + '/' + data.id, body).then(json => {
			console.log(json);
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
				console.log(data.tag);
				return data.tag === tagid;
			}
			return false;
		})[0];
		if (!data) {
			console.log("no data stored for tag " + tagid);
			return;
		}
		const body = {
			"value": data.value + number > 0 ? data.value + number : 0
		}
		postJson(URLS.DATA + '/' + data.id, body).then(json => {
			console.log(json);
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
