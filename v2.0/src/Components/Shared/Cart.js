import React from 'react'
import { Link } from 'react-router-dom'
import Tooltip from '../Shared/Tooltip'
import { connect } from 'react-redux'
import { reduxMoveToDone, reduxRemoveFromTodo, reduxRemoveFromDone } from '../../redux/actions/userActions'
import { reduxChangeData, reduxTeamAddAction, reduxTeamRemoveAction } from '../../redux/actions/pageActions'
import URLS from '../../api/urls'
import { postJson, deleteJson } from '../../api/functions'

/**
 * Cart component
 * renders a list of actions
 * @props title
 *      action list: title, image, id
 * 
 */
class Cart extends React.Component {
	render() {
		return (
			// <!--Cart Outer-->
			<div className="cart-outer mb-5">
				<h3 className="center m-0 cool-font m-cart-header">{this.props.title}</h3>
				<div className="table-outer">
					<table className="cart-table" style={{ width: '100%' }}>
						{this.props.info ?
							<thead className='cart-header'>
								<tr>
									<th>Household</th>
									<th>Action</th>
									<th>Contact</th>
									<th>Phone</th>
									<th>Email</th>
								</tr>
							</thead>
							: null}
						<tbody>
							{this.props.info ? this.renderActionsMoreInfo(this.props.actionRels) : this.renderActions(this.props.actionRels)}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
	renderActions(actionRelations) {
		if (!actionRelations || actionRelations.length <= 0) {
			return (
				<tr key="1"><td colSpan="100%"><p className="m-0 p-2 w-100 text-center cool-font">Nothing here, yet! See all <Link to={this.props.links.actions}> actions </Link></p></td></tr>
			);
		}
		//returns a list of action components
		return Object.keys(actionRelations).map(key => {
			var actionRel = actionRelations[key];
			var action = actionRel.action;
			return (
				<tr key={key}>
					{/* <td colSpan="2" className="prod-column">
                        <img className="thumbnail" src={action.image? action.image.url : null} alt="" />
                    </td> */}
					<td>
						<Tooltip title='Household' text={actionRel.real_estate_unit.name}>
							<div className="column-box">
								<span className='has-tooltip fa fa-home' style={{ textAlign: 'center', fontSize: '18px' }}></span>
							</div>
						</Tooltip>
					</td>
					<td className="prod-column">
						<div className="column-box">
							<Link to={`${this.props.links.actions}/${action.id}`}>
								<h4 className="prod-title padd-top-20">{action.title}</h4>
							</Link>
						</div>
					</td>
					<td className="prod-column">
						{actionRel.status.toLowerCase() === "todo" ?
							<div>
								<Tooltip text='Move to Done'>
									<button onClick={() => this.moveToDone(actionRel)} className="done-btn has-tooltip"> <i className="fa fa-check"></i> </button>
								</Tooltip>
								<Tooltip text='Remove from Todo'>
									<button className="remove-btn has-tooltip" onClick={() => this.removeFromCart(actionRel)}> <i className="fa fa-trash"></i> </button>
								</Tooltip>
							</div>
							:
							<Tooltip text="Oops. This action was added to done by mistake. Remove from our community's impact">
								<button className="remove-btn has-tooltip" onClick={() => this.removeFromCart(actionRel)}> <i className="fa fa-undo"></i> </button>
							</Tooltip>
						}
					</td>

				</tr>
			);
		});
	}

	renderActionsMoreInfo(actionRelations) {
		if (!actionRelations || actionRelations.length <= 0) {
			return (
				<tr key="1"><td colSpan="100%"><p className="m-0 p-2 w-100 text-center cool-font">Nothing here, yet! See all <Link to={this.props.links.actions}> actions </Link></p></td></tr>
			);
		}
		//returns a list of action components
		return Object.keys(actionRelations).map(key => {
			var actionRel = actionRelations[key];
			var action = actionRel.action;
			return (
				<tr key={key}>
					<td>
						<div className="column-box">
							<p>{actionRel.real_estate_unit.name}</p>
						</div>
					</td>
					<td className="prod-column">
						<div className="column-box">
							<h4>{action.title}</h4>
						</div>
					</td>
					<td className="prod-column">
						<div className="column-box">
							{action.vendors ?
								Object.keys(action.vendors).map(key => {
									return (<p> {action.vendors[key].name} </p>)
								})
								: 'MassEnergize'}
						</div>
					</td>
					<td className="prod-column">
						<div className="column-box">
							{action.vendors ?
								Object.keys(action.vendors).map(key => {
									return (<p> {<p> {action.vendors[key].key_contact ? action.vendors[key].key_contact.phone : null} </p>} </p>)
								})

								: '123-456-7890'}
						</div>
					</td>
					<td className="prod-column">
						<div className="column-box">
							{action.vendors ?
								Object.keys(action.vendors).map(key => {
									return (<p> {<p> {action.vendors[key].key_contact ? action.vendors[key].key_contact.email : null} </p>} </p>)
								})
								: 'info@massenergize.org'}
						</div>
					</td>
				</tr>
			);
		});
	}

	/**
	 * Cart Functions
	 */
	moveToDone = (actionRel) => {
		const body = {
			status: "DONE",
			action: actionRel.action.id,
			real_estate_unit: actionRel.real_estate_unit.id,
		}
		postJson(URLS.USER + "/" + this.props.user.id + "/action/" + actionRel.id, body).then(json => {
			console.log(json);
			if (json.success) {
				this.props.reduxMoveToDone(json.data);
				this.addToImpact(actionRel.action);
			}
		}).catch(err => {
			console.log(err)
		})
	}

	removeFromCart = (actionRel) => {
		const status = actionRel.status;
		deleteJson(`${URLS.USER}/${this.props.user.id}/action/${actionRel.id}`).then(json => {
			console.log(json);
			if (json.success) {
				if (status === 'TODO')
					this.props.reduxRemoveFromTodo(actionRel);
				if (status === 'DONE') {
					this.props.reduxRemoveFromDone(actionRel);
					this.removeFromImpact(actionRel.action);
				}
			}
		})
	}

	removeFromImpact = (action) => {
		this.changeDataByName("ActionsCompletedData", -1)
		action.tags.forEach(tag => {
			if (tag.tag_collection && tag.tag_collection.name === "Category") {
				this.changeData(tag.id, -1);
			}
		});
		Object.keys(this.props.user.teams).forEach(key => {
			this.props.reduxTeamRemoveAction(this.props.user.teams[key]);
		})
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
	changeData = (tagid, number) => {
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
		user: store.user.info,
		todo: store.user.todo,
		done: store.user.done,
		communityData: store.page.communityData,
		links: store.links
	}
}

const mapDispatchToProps = {
	reduxMoveToDone, reduxRemoveFromTodo, reduxRemoveFromDone, reduxChangeData, reduxTeamAddAction, reduxTeamRemoveAction
}

export default connect(mapStoreToProps, mapDispatchToProps)(Cart);