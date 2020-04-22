import React from 'react'
import { connect } from 'react-redux';
import PageTitle from '../../Shared/PageTitle';
import Tooltip from '../../Shared/Tooltip';
import Table from 'react-bootstrap/Table';
import { apiCall } from '../../../api/functions'
import { reduxJoinTeam, reduxLeaveTeam } from '../../../redux/actions/userActions'
import { reduxAddTeamMember, reduxRemoveTeamMember } from '../../../redux/actions/pageActions'
import { Link } from 'react-router-dom'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import ContactModal from '../../Shared/ContactModal'
import Modal from '../../Shared/DescModal';
import LoadingCircle from '../../Shared/LoadingCircle';



class TeamsPage extends React.Component {
	constructor(props) {
		super(props);
		this.handleText = this.handleText.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.state = {
			wholeContent: null,
			teamsCarbonDetails: [],
			contact_modal_toggled: false,
			current_team_id: null,
			contact_content: {title:"", msg:""},
			modal_toggled: false,
			modal_content: { title: "...", desc: "..." },
			alert: false,
		}
		this.toggleModal = this.toggleModal.bind(this);
	}
	renderModal = () => {
		if (this.state.modal_toggled) return <Modal content={this.state.modal_content} toggler={this.toggleModal} />
	}
	setModalContent = (title, desc) => {
		this.setState({ modal_content: { title: title, desc: desc } });
	}
	renderContactModal = () => {
		if (this.state.contact_modal_toggled) return <ContactModal content={this.state.modal_content} handleTextFxn={this.handleText} sendMessageFxn={this.sendMessage} toggler={this.toggleContact} />
	}
	handleText = (event) => {
		const old = this.state.contact_content; 
		const newOne = { ...old, [event.target.name]:event.target.value};
		this.setState({ contact_content: newOne });
	}
	sendMessage = () => {
		var spinner = document.getElementById('sender-spinner');
		var msg = this.state.contact_content.msg.trim();
		var title = this.state.contact_content.title.trim();
		const body = {
			team_id: this.state.current_team_id,
			title:title,
			message: msg
		}
		const me = this;
		if (msg !== "" && title !=="") {
			spinner.style.display = "block";
			apiCall(`teams.contactAdmin`, body).then(json => {
				document.getElementById("contact-textarea").value = "";
				document.getElementById("contact-title").value = "";
				spinner.style.display = "none";
				me.toggleContact();
				this.setState({alert:true})
			});
		}
		else{
			alert("Please add a message & title!")
		}
	}

	toggleContact = () => {
		var val = this.state.contact_modal_toggled;
		this.setState({ contact_modal_toggled: !val });
	}
	toggleModal = () => {
		var val = this.state.modal_toggled;
		this.setState({ modal_toggled: !val });
	}
	showAlert = () => {
		if (this.state.alert) {
			return (
				<div>
					<p className="alert alert-success alert-dismissible fade show">Your message was successfully sent!
						<button type="button" className="close" onClick = {()=>{this.setState({alert:false})}} aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</p>
				</div>
			)
		}
	}
	render() {

		const teams = this.props.teamsPage;
		if (teams === null) {
			return (
				<div className="boxed_wrapper" >
					{/* <h2 className='text-center' style={{ color: '#9e9e9e', margin: "190px 150px", padding: "30px", border: 'solid 2px #fdf9f9', borderRadius: 10 }}> Sorry, there are not teams for this community yet :( </h2> */}
						<LoadingCircle />
				</div>
			)
		}
		else if( teams.length === 0){
			return (
				<div className="boxed_wrapper" >
					<h2 className='text-center' style={{ color: '#9e9e9e', margin: "190px 150px", padding: "30px", border: 'solid 2px #fdf9f9', borderRadius: 10 }}> Sorry, there are not teams for this community yet :( </h2>
						{/* <LoadingCircle /> */}
				</div>
			)
		}
		return (
			<>
				{this.renderContactModal()}
				{this.renderModal()}
				<div className="boxed_wrapper" >
					<BreadCrumbBar links={[{ name: 'Teams' }]} />
					<div className="p-5" style={{height:window.screen.height -120}}>
					
						<PageTitle>Teams in this Community</PageTitle>
						<p className="mob-appear" style={{color:'rgb(116, 176, 229)', textAlign:'center'}}><i className="fa fa-backward"/>  Swipe on your screen to the left, to see all table content <i className="fa fa-backward"/> </p>
						<Table bordered hover responsive className="teams-table">
							<thead>
								<tr>
									<th>Team Name</th>
									<th>Households</th>
									<th>Actions Completed</th>
									<th>Actions / Household</th>
									<th>
										<Tooltip text="Estimated total impact in pounds of CO2-equivalent emissions per year avoided by the actions taken by team members" dir="left">
											<span className="has-tooltip">Emissions Impact</span>
										</Tooltip>
									</th>
									<th>Key Contact</th>
									<th>Join Team</th>
								</tr>
							</thead>
							<tbody>
								{this.renderTeamsData(teams)}
							</tbody>
						</Table>
						{this.showAlert()}
					</div>
				</div>
			</>
		);
	}




	renderTeamsData(teamsData) {
		//console.log(teamsData)		
		var teamsSorted = teamsData.slice(0);
		for (let i = 0; i < teamsSorted.length; i++) {
			let members = teamsSorted[i].members;
			//let households = teamsSorted[i].households;
			let actions_completed = teamsSorted[i].actions_completed;
			var avrg = Number(actions_completed) / Number(members);
			avrg = (!isNaN(avrg)) ? avrg.toFixed(1) : 0;
			teamsSorted[i]["avrgActionsPerMember"] = avrg;
		}

		teamsSorted = teamsSorted.sort((a, b) => {
			return b.avrgActionsPerMember - a.avrgActionsPerMember;
		});

		return teamsSorted.map((obj, index) => {
			this.goalsList(obj.team.id).then(json => {
				if (json && json.success && json.data.length > 0) {
					var c = json.data[0];
					document.getElementById('carbo-' + obj.team.id).innerHTML = c;
				}
			});

			const desc = obj.team.description.length > 70 ? obj.team.description.substr(0, 70) + "..." : obj.team.description;
			return (
				
				<tr key={index.toString()}>
					<td>{obj.team.name}
            			<Tooltip title={obj.team.name} text={desc} dir="right">
							<div>
								<small className="more-hyperlink" onClick={() => { this.setModalContent(obj.team.name, obj.team.description); this.toggleModal() }}>More...</small>
							</div>
						</Tooltip>
					</td>
					<td>{obj.members}</td>
					<td>{obj.actions_completed}</td>
					<td>{obj.avrgActionsPerMember}</td>
					<td id={'carbo-' + obj.team.id}>{obj.carbon_footprint_reduction}</td>
					{this.props.user ?
						<td><button className="contact-admin-btn round-me" onClick={() => { this.setModalContent(obj.team.name, obj.team.description); this.setState({ contact_modal_toggled: true, current_team_id: obj.team.id }) }}>Contact Admin</button></td>
						:
						<td>
							<Link to={this.props.links.signin}>Sign In</Link> to contact admin
						</td>
					}
					{this.props.user ?
						<td>
							{this.inTeam(obj.team.id) ?
								<button className='thm-btn red round-me' onClick={() => { this.leaveTeam(this.props.user, obj.team) }}><i className='fa fa-hand-peace-o'> </i> Leave</button>

								:
								<button className='thm-btn round-me' onClick={() => {
									this.joinTeam(obj.team)
								}}><i className='fa fa-user-plus' ></i> Join </button>
							}

						</td>
						:
						<td>
							<Link to={this.props.links.signin}>Sign In</Link> to join a team
						</td>
					}
					{/* <td>{obj.ghgSaved}</td> */}
				</tr>
			)


		});
	}
	inTeam = (team_id) => {
		if (!this.props.user) {
			return false;
		}
		return this.props.user.teams.filter(team => { return team.id === team_id }).length > 0;
	}

	goalsList = (team_id) => {
		const body = {
			team_id: team_id
		}
		return apiCall(`goals.list`, body);
	}

	leaveTeam = (user, team) => {
		const body = {
			team_id: team.id,
			user_id: user.id
		}
		apiCall(`teams.leave`, body).then(json => {
			// speed up by using redux store
			if (json.success) {
				this.props.reduxLeaveTeam(team);
				this.props.reduxRemoveTeamMember({
					team: team,
					member: {
						households: this.props.user.households.length,
						actions: this.props.todo && this.props.done ? this.props.todo.length + this.props.done.length : 0,
						actions_completed: this.props.done.length,
						actions_todo: this.props.todo.length
					}
				});
			}
		}).catch(error => {
			console.log(error);
		});
	}
	joinTeam = (team) => {
		const body = {
			user_id: this.props.user.id,
			team_id: team.id,
		}
		apiCall('teams.join', body).then(json => {
			if (json.success) {
				this.props.reduxJoinTeam(team);
				this.props.reduxAddTeamMember({
					team: team,
					member: {
						households: this.props.user.households.length,
						actions: this.props.todo && this.props.done ? this.props.todo.length + this.props.done.length : 0,
						actions_completed: this.props.done.length,
						actions_todo: this.props.todo.length
					}
				});
		
			}
		}).catch(error => {
			console.log(error);
		})

	}
}
const mapStoreToProps = (store) => {
	return {
		user: store.user.info,
		todo: store.user.todo,
		done: store.user.done,
		teamsPage: store.page.teamsPage,
		links: store.links
	}
}
const mapDispatchToProps = {
	reduxJoinTeam,
	reduxLeaveTeam,
	reduxAddTeamMember,
	reduxRemoveTeamMember
}
export default connect(mapStoreToProps, mapDispatchToProps)(TeamsPage);