import React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'

// import { threadId } from 'worker_threads'
import URLS from '../../../api/urls'
import { postJson, deleteJson } from '../../../api/functions'

import SignOutButton from '../../Shared/SignOutButton'
import Cart from '../../Shared/Cart'
import Counter from './Counter'
import AddingHouseholdForm from './AddingHouseholdForm'
import EditingProfileForm from './EditingProfileForm'

import { reduxMoveToDone, reduxAddHousehold, reduxEditHousehold, reduxRemoveHousehold, reduxLeaveCommunity } from '../../../redux/actions/userActions'
// import { watchFile } from 'fs';
import Tooltip from '../../Shared/Tooltip'
import JoiningCommunityForm from './JoiningCommunityForm';

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
        }
    }

    render() {
        if (!this.props.user)
            return <Redirect to='/login'> </Redirect>

        if (this.props.user.households.length === 0) {
            this.addDefaultHousehold();
        }
        const { user } = this.props;
        //if the user hasnt registered to our back end yet, but still has a firebase login, send them to register
        //if (!user) return <Redirect to='/register?form=2' />
        return (
            <div className='boxed_wrapper' onClick={this.clearError}>
                <div className="container">
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
                                                <Counter end={this.props.done.length} icon={"icon-money"} title={"Actions Completed"} />
                                            </div>
                                            <div className="column counter-column  d-lg-block d-none col-4 ">
                                                <Counter end={this.props.todo.length} icon={"icon-money"} title={"Actions To Do"} />
                                            </div>
                                            <div className="column counter-column col-lg-4 col-6"  >
                                                <Counter end={this.props.done.length * 10} unit={"tons"} icon={"icon-money"} title={"Tons of Carbon Saved"} />
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
                                </tbody>
                            </table>
                            <br />
                            <table className="profile-table" style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <th> Your teams </th>
                                        <th></th>
                                    </tr>
                                    {this.renderTeams(user.teams)}
                                    <tr>
                                        <td colSpan={2} align='center'><Link className="thm-btn" to='/teams' style={{ margin: '5px' }}>Join another Team</Link></td>
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
                                                <JoiningCommunityForm closeForm={() => this.setState({joiningCom:false})}/> 
                                                
                                            </td>
                                            :
                                            <td colSpan={2}>
                                                <button className="thm-btn" onClick={()=> this.setState({joiningCom: true})}>Join another Community</button>
                                                </td>
                                        }
                                    </tr>
                                </tbody>
                            </table>
                            <br />
                            {this.state.deletingHHError ?
                                <p className='text-danger'> {this.state.deletingHHError}</p> : null
                            }


                            <br />
                            <br />
                        </div>
                        {/* makes the todo and completed actions carts */}
                        <div className="col-lg-6 col-md-6 col-12" style={{ paddingRight: "0px", marginRight: "0px" }}>

                            <h3 className="col-12 text-right">
                                <SignOutButton style={{ display: 'inline-block' }} />
                            </h3>
                            <br />
                            <Cart title="To Do List" actionRels={this.props.todo} status="TODO" />
                            <Cart title="Completed Actions" actionRels={this.props.done} status="DONE" />

                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderCommunities(communities) {
        if (!communities) return <tr><td colSpan={2}>You haven't joined any communities yet</td></tr>;
        return Object.keys(communities).map(key => {
            const community = communities[key]
            return (<tr key={key}>
                <td> <a href={'//' + community.subdomain + '.massenergize.org'}> {community.name} </a></td>
                <td> <button className="remove-btn" onClick={()=>this.leaveCommunity(community)}> <i className="fa fa-trash"></i></button> </td>
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
                <td> <button className="remove-btn"> <i className="fa fa-trash"></i></button> </td>
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
    }
    editHousehold = (household) => {
        this.props.reduxEditHousehold(household);
    }

    deleteHousehold = (household) => {
        if (this.props.user.households.length > 1) {
            deleteJson(`${URLS.HOUSEHOLD}/${household.id}`).then(json => {
                console.log(json);
                if (json.success) {
                    this.props.reduxRemoveHousehold(household);
                }
            }
            )
        } else {
            this.setState({
                deletingHHError: 'You need to have at least one household. Try editing the name and location or adding another household before deleting this one'
            })
        }
    }

    leaveCommunity = (community) => {
        if(this.props.user.communities.length > 1) {
            var newCommunityIds = [];

            this.props.user.communities.forEach(com => {
                if(com.id !== community.id){
                    newCommunityIds.push(com.id);
                }
            });
            const body = {
                communities: newCommunityIds
            }
            postJson(`${URLS.USER}/${this.props.user.id}`, body).then(json => {
                console.log(json)
                if(json.success){
                    this.props.reduxLeaveCommunity(community);
                }
            })
        }
    }

    clearError = () => {
        if (this.state.deletingHHError) {
            this.setState({ deletingHHError: null })
        }
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
        households: store.user.info ? store.user.info.households : null
    }
}
const mapDispatchToProps = { 
    reduxMoveToDone, 
    reduxAddHousehold, 
    reduxEditHousehold,
    reduxRemoveHousehold, 
    reduxLeaveCommunity
};
export default connect(mapStoreToProps, mapDispatchToProps)(ProfilePage);