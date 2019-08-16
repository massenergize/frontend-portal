import React from 'react'
import { connect } from 'react-redux';
import PageTitle from '../../Shared/PageTitle';
import Tooltip from '../../Shared/Tooltip';
import Table from 'react-bootstrap/Table';
import LoadingCircle from '../../Shared/LoadingCircle';
import {postJson} from '../../../api/functions'
import URLS from '../../../api/urls'
import {reduxJoinTeam} from '../../../redux/actions/userActions'
import {reduxAddTeamMember} from '../../../redux/actions/pageActions'
import {Link} from 'react-router-dom'



class TeamsPage extends React.Component {
    render() {
        const teams = this.props.teamsPage;
        if (teams == null) return <LoadingCircle />

        return (
            <div className="boxed_wrapper p-5">
                <PageTitle>Teams Leaderboard</PageTitle>
                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Team Name</th>
                            <th># Households</th>
                            <th># Actions Completed</th>
                            <th>Average # Actions/Household</th>
                            <th>
                                <Tooltip text="Brad's paragraph here" dir="left">
                                    <span className="has-tooltip">Carbon Impact</span>
                                </Tooltip>
                            </th>
                            <th>Join Team</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTeamsData(teams)}
                    </tbody>
                </Table>
            </div>
        );
    }

    renderTeamsData(teamsData) {
        var teamsSorted = teamsData.slice(0);
        for (let i = 0; i < teamsSorted.length; i++) {
            let households = teamsSorted[i].households;
            let actions_completed = teamsSorted[i].actions_completed;
            var avrg = Number(actions_completed) / Number(households);
            avrg = (!isNaN(avrg)) ? avrg.toFixed(1) : 0;
            teamsSorted[i]["avrgActionsPerHousehold"] = avrg;
        }

        teamsSorted = teamsSorted.sort((a, b) => {
            return b.avrgActionsPerHousehold - a.avrgActionsPerHousehold;
        });

        return teamsSorted.map((obj) => {
            return (
                <tr>
                    <td>{obj.team.name} &nbsp;
                        <Tooltip title={obj.team.name} text={obj.team.description} dir="right">
                            <span className="fa fa-info-circle" style={{ color: "#428a36" }}></span>
                        </Tooltip>
                    </td>
                    <td>{obj.households}</td>
                    <td>{obj.actions_completed}</td>
                    <td>{obj.avrgActionsPerHousehold}</td>
                    <td>...</td>
                    {this.props.user?
                    <td>
                        {this.inTeam(obj.team.id) ?
                            <button className='thm-btn red'><i className='fa fa-hand-peace-o'> </i> Leave</button>
                            :
                            <button className='thm-btn' onClick={() => {
                                console.log('clicked')
                                this.joinTeam(obj.team)
                            }}><i className='fa fa-user-plus' > </i> Join </button>
                        }
                    </td>
                    :
                    <td>
                        <p><Link to='/login'>Sign In</Link> to join a team</p>
                    </td>
                    }
                    {/* <td>{obj.ghgSaved}</td> */}
                </tr>
            )
        });
    }
    inTeam = (team_id) => {
        console.log(team_id);
        if (!this.props.user) {
            return false;
        }
        console.log(this.props.user.teams);
        return this.props.user.teams.filter(team => { return team.id === team_id }).length > 0;
    }

    joinTeam = (team) => {
        console.log('woah')
        const body={
            members: this.props.user.id,
        }
        postJson(`${URLS.TEAM}/${team.id}`, body).then(json => {
            console.log(json)
            if(json.success){
                this.props.reduxJoinTeam(team);
                
                this.props.reduxAddTeamMember({
                    team: team,
                    member: {
                        households: this.props.user.households.length,
                        actions: this.props.todo.length+this.props.done.length,
                        actions_completed: this.props.done.length,
                        actions_todo: this.props.todo.length
                    }
                });
            }
        })
    }
}
const mapStoreToProps = (store) => {
    return {
        user: store.user.info,
        todo: store.user.todo,
        done: store.user.done,
        teamsPage: store.page.teamsPage,
    }
}
const mapDispatchToProps = {
    reduxJoinTeam,
    reduxAddTeamMember
}
export default connect(mapStoreToProps, mapDispatchToProps)(TeamsPage);