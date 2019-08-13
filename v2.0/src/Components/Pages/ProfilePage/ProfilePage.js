import React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'

import SignOutButton from '../../Shared/SignOutButton'
import Cart from '../../Shared/Cart'
import LoadingCircle from '../../Shared/LoadingCircle'
import Counter from './Counter'
// import { threadId } from 'worker_threads'
import URLS from '../../../api/urls'
import { getJson, postJson } from '../../../api/functions'

import { isLoaded } from 'react-redux-firebase';
import AddingHouseholdForm from './AddingHouseholdForm';
import { reduxMoveToDone, reduxAddHousehold, reduxEditHousehold} from '../../../redux/actions/userActions'
// import { watchFile } from 'fs';



class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            //todo: [],
            //done: [],
            //households: [],
            selectedHousehold: null,
            addingHH: false,
            editingHH: null,
            addingCom: false,
        }
    }
    componentDidMount() {
        Promise.all([
            getJson(URLS.USER + "/e/" + this.props.auth.email + "/actions" + "?status=TODO"),
            getJson(URLS.USER + "/e/" + this.props.auth.email + "/actions" + "?status=DONE"),
        ]).then(myJsons => {
            if (myJsons[0].success && myJsons[0].data) {
                this.setState({
                    todo: myJsons[0].data,
                    done: myJsons[1].data,
                    loaded: true
                })
            } else {
                if (isLoaded(this.props.auth))
                    this.setState({
                        notRegistered: true
                    });
            }
        }).catch(err => {
            console.log(err)
        });
    }
    render() {
        //avoids trying to render before the promise from the server is fulfilled
        if (!this.props.auth.isLoaded) { //if the auth isn't loaded wait for a bit
            return <LoadingCircle />;
        }
        if (!this.props.user)
            return <Redirect to='/login'> </Redirect>
        //if the auth is loaded and there is a user logged in but the user has not been fetched from the server remount
        if (isLoaded(this.props.auth) && this.props.auth.uid && !this.props.user) {
            this.componentDidMount();
            return <LoadingCircle />;
        }
        if (!this.state.loaded) return <LoadingCircle />;
        const { auth } = this.props;
        const { user } = this.props;
        //if the user hasnt registered to our back end yet, but still has a firebase login, send them to register
        if (!user) return <Redirect to='/register?form=2' />
        return (
            <div className='boxed_wrapper'>
                <div className="container">
                    <div className="row" style={{ paddingRight: "0px", marginRight: "0px" }}>
                        <div className="col-lg-8 col-md-7  col-12">
                            <h3>{user ?
                                <div>
                                    <span style={{ color: "#8dc63f" }}>Welcome</span> {user.preferred_name}
                                </div>
                                :
                                "Your Profile"
                            } <SignOutButton className="float_right" /> </h3>
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
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-6 col-12">
                                        <table className="profile-table" style={{ width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <th> Your Communities </th>
                                                    <th></th>
                                                </tr>
                                                {this.renderCommunities(user.communities)}
                                                <tr>
                                                    <td colSpan={2}><button className="thm-btn" disabled>Join another Community</button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-lg-6 col-12">
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
                                                            <button className="thm-btn" onClick={() => this.setState({ addingHH: true, editingHH: null })}>Add Another Household</button>
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <br />
                        </div>
                        {/* makes the todo and completed actions carts */}
                        <div className="col-lg-4 col-md-5 col-12" style={{ paddingRight: "0px", marginRight: "0px" }}>
                            <Cart title="To Do List" actionRels={this.props.todo} status="TODO" moveToDone={this.moveToDone} />
                            <Cart title="Completed Actions" actionRels={this.props.done} status="DONE" moveToDone={this.moveToDone} />
                            <div className="col-12 text-center">
                                <Link to="actions"><button class="thm-btn">Discover All Actions</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderCommunities(communities) {
        if(!communities) return null;
        return Object.keys(communities).map(key => {
            const community = communities[key]
            return (<tr key={key}>
                <td> <a href={'//' + community.subdomain + '.massenergize.org'}> {community.name} </a></td>
                <td> <button className="remove-btn"> <i className="fa fa-trash"></i></button> </td>
            </tr>
            );
        })
    }

    renderHouseholds(households) {
        return Object.keys(households).map(key => {
            const house = households[key]
            return (
                <>
                    {this.state.editingHH === house.id ?
                        <tr>
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
                        :
                        <tr key={key}>
                            <td>{house.name}</td>
                            <td><button className="edit-btn"> <i className="fa fa-edit" onClick={() => this.setState({ editingHH: house.id, addingHH: false })}></i> </button></td>
                            <td><button className="remove-btn"> <i className="fa fa-trash"></i> </button></td>
                        </tr>
                    }
                </>
            );
        })
    }

    addHousehold = (household) => {
        this.props.reduxAddHousehold(household);
    }
    editHousehold = (household) => {
        this.props.reduxEditHousehold(household);
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
            }
            //just update the state here
        }).catch(err => {
            console.log(err)
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
const mapDispatchToProps = { reduxMoveToDone, reduxAddHousehold, reduxEditHousehold };
export default connect(mapStoreToProps, mapDispatchToProps)(ProfilePage);