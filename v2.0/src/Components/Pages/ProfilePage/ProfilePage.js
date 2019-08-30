import React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'

// import { threadId } from 'worker_threads'
import URLS from '../../../api/urls'
import { postJson, deleteJson } from '../../../api/functions'

import SignOutButton from '../../Shared/SignOutButton'
import Cart from '../../Shared/Cart'
import BreadCrumbBar from '../../Shared/BreadCrumbBar'
import Counter from './Counter'
import AddingHouseholdForm from './AddingHouseholdForm'
import EditingProfileForm from './EditingProfileForm'

import { 
    reduxMoveToDone, 
    reduxAddHousehold, 
    reduxEditHousehold, 
    reduxRemoveHousehold, 
    reduxLeaveCommunity, 
    reduxLoadUserCommunities, 
    reduxLeaveTeam 
} from '../../../redux/actions/userActions'
import { 
    reduxChangeData, 
    reduxRemoveTeamMember, 
    reduxTeamRemoveHouse, 
    reduxTeamRemoveAction,
    reduxTeamAddHouse
} from '../../../redux/actions/pageActions'
// import { watchFile } from 'fs';
import Tooltip from '../../Shared/Tooltip'
import JoiningCommunityForm from './JoiningCommunityForm';
import PrintCart from '../../Shared/PrintCart';

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,

            selectedHousehold: null,
            editingHH: null,

            joiningCom: false,
            addingHH: false,
            editingProfile: false,

            printing: false
        }
    }

    render() {
        if (!this.props.user)
            return <Redirect to='/login'> </Redirect>

        if (this.props.user.households.length === 0) {
            this.addDefaultHousehold();
        }
        if (this.props.community) {
            if (this.props.user.communities.filter(com => { return com.id === this.props.community.id }).length === 0) {
                this.addDefaultCommunity();
            }
        }
        const { user } = this.props;
        //if the user hasnt registered to our back end yet, but still has a firebase login, send them to register
        //if (!user) return <Redirect to='/register?form=2' />
        return (
            <>
                <BreadCrumbBar links={[{ name: 'Profile' }]} />
                <div className='boxed_wrapper' onClick={this.clearError}>
                    <div className="container">
                        {this.state.printing ?
                            <>
                                <PrintCart />
                                <button className='thm-btn text-center' onClick={() => this.setState({ printing: false })}> Cancel</button>
                            </>
                            :
                            <div className="row" style={{ paddingRight: "0px", marginRight: "0px" }}>
                                <div className="col-lg-6 col-md-6  col-12">
                                    {!this.state.editingProfile ?
                                        <>
                                            <h3>{user ?
                                                <div style={{ display: 'inline-block' }}>
                                                    <span style={{ color: "#8dc63f" }}>Welcome</span> {user.preferred_name}
                                                </div>
                                                :
                                                "Your Profile"
                                            }
                                                &nbsp;&nbsp;
                                    <button style={{ display: 'inline-block', color: 'green' }} onClick={() => this.setState({ editingProfile: true })}> <i className='fa fa-edit' /></button>
                                                &nbsp;&nbsp;
                                    </h3>
                                        </>
                                        :
                                        <>
                                            <EditingProfileForm
                                                full_name={this.props.user.full_name}
                                                preferred_name={this.props.user.preferred_name}
                                                closeForm={() => this.setState({ editingProfile: false })}
                                            />
                                        </>
                                    }
                                    <section className="fact-counter style-2 sec-padd" >
                                        <div className="container">
                                            <div className="counter-outer" style={{ background: "#333", width: "100%" }}>
                                                <div className="row no-gutter">
                                                    <div className="column counter-column col-lg-4 col-6 ">
                                                        <Counter end={this.props.done ? this.props.done.length : 0} icon={"icon-money"} title={"Actions Completed"} />
                                                    </div>
                                                    <div className="column counter-column  d-lg-block d-none col-4 ">
                                                        <Counter end={this.props.todo ? this.props.todo.length : 0} icon={"icon-money"} title={"Actions To Do"} />
                                                    </div>
                                                    <div className="column counter-column col-lg-4 col-6"  >
                                                        <Counter end={this.props.done ? this.props.done.length * 10 : 0} unit={"tons"} icon={"icon-money"} title={"Tons of Carbon Saved"} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <table className="profile-table" style={{ width: '100%' }}>
                                        <tbody>
                                            <tr>
                                                <th> Your Households </th>
                                                <th />
                                                <th />
                                            </tr>
                                            {this.renderHouseholds(user.households)}
                                            {!this.state.editingHH ?
                                                <tr>
                                                    <td colSpan={3}>
                                                        {this.state.addingHH ?
                                                            <>
                                                                <AddingHouseholdForm
                                                                    user={this.props.user}
                                                                    addHousehold={this.addHousehold}
                                                                    closeForm={() => this.setState({ addingHH: false })}
                                                                />
                                                                <button
                                                                    className="thm-btn"
                                                                    onClick={() => this.setState({ addingHH: false })}
                                                                    style={{ width: '99%' }}>Cancel
                                                                    </button>
                                                            </>
                                                            :
                                                            <button className="thm-btn" onClick={() => this.setState({ addingHH: true, editingHH: null })}>If you have another household, let us know</button>
                                                        }
                                                    </td>
                                                </tr>
                                                : null}

                                        </tbody>
                                    </table>
                                    {this.state.deletingHHError ?
                                        <p className='text-danger'> {this.state.deletingHHError}</p> : null
                                    }
                                    <br />
                                    <table className="profile-table" style={{ width: '100%' }}>
                                        <tbody>
                                            <tr>
                                                <th> Your teams </th>
                                                <th></th>
                                            </tr>
                                            {this.renderTeams(user.teams)}
                                            <tr>
                                                <td colSpan={2} align='center'><Link className="thm-btn" to='/teams' style={{ margin: '5px' }}>{this.props.user.teams.length > 0 ? 'Join another Team' : 'Join a Team!'}</Link></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br />
                                    <table className="profile-table" style={{ width: '100%' }}>
                                        <tbody>
                                            <tr>
                                                <th> Your Communities </th>
                                                <th></th>
                                            </tr>
                                            {this.renderCommunities(user.communities)}
                                            <tr>
                                                {this.state.joiningCom ?
                                                    <td colSpan={2}>
                                                        <JoiningCommunityForm closeForm={() => this.setState({ joiningCom: false })} />

                                                    </td>
                                                    :
                                                    <td colSpan={2}>
                                                        <button className="thm-btn" onClick={() => this.setState({ joiningCom: true })}>Join another Community</button>
                                                    </td>
                                                }
                                            </tr>
                                        </tbody>
                                    </table>
                                    {this.state.leaveComError ?
                                        <p className='text-danger'> {this.state.leaveComError}</p> : null
                                    }
                                    <br />
                                    <br />
                                    <br />
                                </div>
                                {/* makes the todo and completed actions carts */}
                                <div className="col-lg-6 col-md-6 col-12" style={{ paddingRight: "0px", marginRight: "0px" }}>

                                    <h3 className="col-12 text-right">
                                        <SignOutButton style={{ display: 'inline-block' }} />
                                    </h3>
                                    <br />
                                    {this.props.todo ?
                                        <Cart title="To Do List" actionRels={this.props.todo} status="TODO" /> : null}
                                    {this.props.done ?
                                        <Cart title="Completed Actions" actionRels={this.props.done} status="DONE" /> : null}
                                    <button className='thm-btn text-center' onClick={() => this.setState({ printing: true })}> Summarize your actions</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </>
        );
    }

    renderCommunities(communities) {
        if (!communities) return <tr><td colSpan={2}>You haven't joined any communities yet</td></tr>;
        return Object.keys(communities).map(key => {
            const community = communities[key]
            return (<tr key={key}>
                <td> <a href={'//' + community.subdomain + '.massenergize.org'}> {community.name} </a></td>
                <td> <button className="remove-btn" onClick={() => this.leaveCommunity(community)}> <i className="fa fa-trash"></i></button> </td>
            </tr>
            );
        })
    }
    renderTeams(teams) {
        if (!teams) return null;
        return Object.keys(teams).map(key => {
            const team = teams[key]
            return (<tr key={key}>
                <td>
                    {team.name} &nbsp;
                    <Tooltip title={team.name} text={team.description} dir="right">
                        <span className="fa fa-info-circle" style={{ color: "#428a36" }}></span>
                    </Tooltip>
                </td>
                <td> <button className="remove-btn"> <i className="fa fa-trash" onClick={() => this.leaveTeam(team)}></i></button> </td>
            </tr>
            );
        })
    }
    renderHouseholds(households) {
        return Object.keys(households).map(key => {
            const house = households[key]
            if (this.state.editingHH === house.id) {
                return (
                    <tr key={key}>
                        <td colSpan={3}>
                            <AddingHouseholdForm
                                householdID={house.id}
                                name={house.name}
                                location={house.location}
                                unittype={house.unit_type}
                                user={this.props.user}
                                editHousehold={this.editHousehold}
                                closeForm={() => this.setState({ editingHH: null })}
                            />
                            <button
                                className="thm-btn"
                                onClick={() => this.setState({ addingHH: false, editingHH: null })}
                                style={{ width: '99%' }}>Cancel
                        </button>
                        </td>
                    </tr>
                )
            } else {
                return (
                    <tr key={key}>
                        <td>
                            {house.name} &nbsp;
                            <Tooltip title={house.name} text={
                                house.location ? "Location: " + house.location + ", Type: " + house.unit_type : "No location for this household, Type: " + house.unit_type
                            } dir="right">
                                <span className="fa fa-info-circle" style={{ color: "#428a36" }}></span>
                            </Tooltip>
                        </td>
                        <td><button className="edit-btn"> <i className="fa fa-edit" onClick={() => this.setState({ editingHH: house.id, addingHH: false })}></i> </button></td>
                        <td><button className="remove-btn"> <i className="fa fa-trash" onClick={() => this.deleteHousehold(house)}></i> </button></td>
                    </tr>
                )
            }
        })
    }


    addHousehold = (household) => {
        this.props.reduxAddHousehold(household);
        Object.keys(this.props.user.teams).map(key => {
            const team = this.props.user.teams[key];
            this.props.reduxTeamAddHouse(team);
        })
        this.addHouseToImpact();
    }
    editHousehold = (household) => {
        this.props.reduxEditHousehold(household);
    }

    deleteHousehold = (household) => {
        if (this.props.user.households.length > 1) {
            deleteJson(`${URLS.HOUSEHOLD}/${household.id}`).then(json => {
                console.log(json);
                if (json.success) {
                    var numDone = this.props.done.filter(a => a.real_estate_unit.id === household.id).length;
                    this.props.reduxRemoveHousehold(household);
                    this.removeHouseFromImpact(numDone);
                }
            }
            )
        } else {
            this.setState({
                deletingHHError: 'You need to have at least one household. Try editing the name and location or adding another household before deleting this one'
            })
        }
    }
    removeHouseFromImpact(numDone) {
        this.changeDataByName("EngagedHouseholdsData", -1)
        Object.keys(this.props.user.teams).forEach(key => {
            this.props.reduxTeamRemoveHouse(this.props.user.teams[key]);
            for(var i = 0; i < numDone; i ++){
                this.props.reduxTeamRemoveAction(this.props.user.teams[key]);
            }
        })
    }
    addHouseToImpact() {
        this.changeDataByName("EngagedHouseholdsData", 1)
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

    leaveCommunity = (community) => {
        if (community.id !== this.props.community.id) {
            var newCommunityIds = [];

            this.props.user.communities.forEach(com => {
                if (com.id !== community.id) {
                    newCommunityIds.push(com.id);
                }
            });
            const body = {
                communities: newCommunityIds
            }
            postJson(`${URLS.USER}/${this.props.user.id}`, body).then(json => {
                console.log(json)
                if (json.success) {
                    this.props.reduxLeaveCommunity(community);
                }
            })
        } else {
            this.setState({
                leaveComError: "You can't leave your home community"
            })
        }
    }

    leaveTeam = (team) => {
        if (team && this.props.user) {
            deleteJson(`${URLS.TEAM}/${team.id}/member/${this.props.user.id}`).then(json => {
                console.log(json);
                if (json.success) {
                    this.props.reduxLeaveTeam(team);

                    this.props.reduxRemoveTeamMember({
                        team: team,
                        member: {
                            households: this.props.user.households.length,
                            actions: this.props.todo.length + this.props.done.length,
                            actions_completed: this.props.done.length,
                            actions_todo: this.props.todo.length
                        }
                    });
                }
            })
        }
    }

    clearError = () => {
        if (this.state.deletingHHError) {
            this.setState({
                deletingHHError: null,
            })
        }
        if (this.state.leaveComError) {
            this.setState({
                leaveComError: null,
            })
        }
    }
    addDefaultCommunity = () => {
        const body = {
            "communities": this.props.community.id,
        }
        var postURL = URLS.USER + "/" + this.props.user.id;
        /** Collects the form data and sends it to the backend */
        postJson(postURL, body).then(json => {
            console.log(json);
            if (json.success) {
                this.props.reduxLoadUserCommunities(json.data.communities);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    addDefaultHousehold = () => {
        const body = {
            "name": 'Home',
            "unit_type": 'RESIDENTIAL',
            "location": ''
        }
        var postURL = URLS.USER + "/" + this.props.user.id + "/households";
        /** Collects the form data and sends it to the backend */
        postJson(postURL, body).then(json => {
            console.log(json);
            if (json.success) {
                this.addHousehold(json.data);
                var householdIds = [];
                this.props.user.households.forEach(household => {
                    householdIds.push(household.id);
                })
                fetch(URLS.USER + "/" + this.props.user.id, {
                    method: 'post',
                    body: JSON.stringify({
                        "preferred_name": this.props.user.preferred_name,
                        "email": this.props.user.email,
                        "full_name": this.props.user.full_name,
                        "real_estate_units": [
                            ...householdIds
                        ]
                    })
                }).then(response => {
                    return response.json()
                }).then(json => {
                    console.log(json);
                });
            }
        }).catch(error => {
            console.log(error);
        })
    }
}
const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth,
        user: store.user.info,
        todo: store.user.todo,
        done: store.user.done,
        communities: store.user.info ? store.user.info.communities : null,
        community: store.page.community,
        communityData: store.page.communityData,
        households: store.user.info ? store.user.info.households : null
    }
}
const mapDispatchToProps = {
    reduxMoveToDone,
    reduxAddHousehold,
    reduxEditHousehold,
    reduxRemoveHousehold,
    reduxLeaveCommunity,
    reduxLoadUserCommunities,
    reduxChangeData,
    reduxLeaveTeam,
    reduxRemoveTeamMember,
    reduxTeamRemoveHouse, 
    reduxTeamRemoveAction,
    reduxTeamAddHouse
};
export default connect(mapStoreToProps, mapDispatchToProps)(ProfilePage);