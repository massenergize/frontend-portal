import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import SignOutButton from './SignOutButton'
import Cart from '../../Shared/Cart'
import LoadingCircle from '../../Shared/LoadingCircle'
import Counter from './Counter'
// import { threadId } from 'worker_threads'
import URLS, { getJson } from '../../api_v2'
import { isLoaded } from 'react-redux-firebase';
// import { watchFile } from 'fs';



class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            user: null,
            todo: [],
            done: [],
            households: [],
        }
    }
    componentDidMount() {
        Promise.all([
            getJson(URLS.USERS + "?email=" + this.props.auth.email),
            getJson(URLS.USER + "/e/"+this.props.auth.email+"/actions"+"?status=TODO"),
            getJson(URLS.USER + "/e/"+this.props.auth.email+"/actions"+"?status=DONE"),
            getJson(URLS.USER + "/e/"+this.props.auth.email+"/households")
        ]).then(myJsons => {
            console.log(myJsons[0]);
            this.setState({
                user: myJsons[0].data[0],
                todo: myJsons[1].data,
                done: myJsons[2].data,
                households: myJsons[3].data,
                loaded: true
            })
        }).catch(err => {
            console.log(err)
        });
    }
    render() {
        //avoids trying to render before the promise from the server is fulfilled
        if (!isLoaded(this.props.auth)){ //if the auth isn't loaded wait for a bit
            return <LoadingCircle/>;
        }
        //if the auth is loaded and there is a user logged in but the user has not been fetched from the server remount
        if (isLoaded(this.props.auth) && this.props.auth.uid && !this.state.user) { 
            this.componentDidMount();
            return <LoadingCircle/>;
        }
        if (!this.state.loaded) return <LoadingCircle />;
        const { auth } = this.props;
        const { user } = this.state;
        console.log(this.state.households);
        if (!auth.uid) return <Redirect to='/login' />
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
                            } </h3>
                            <section className="fact-counter style-2 sec-padd" >
                                <div className="container">
                                    <div className="counter-outer" style={{ background: "#333", width: "100%" }}>
                                        <div className="row no-gutter">
                                            <div className="column counter-column col-lg-4 col-6 ">
                                                <Counter end={this.state.done.length} icon={"icon-money"} title={"Actions Completed"} />
                                            </div>
                                            <div className="column counter-column  d-lg-block d-none col-4 ">
                                                <Counter end={this.state.todo.length} icon={"icon-money"} title={"Actions To Do"} />
                                            </div>
                                            <div className="column counter-column col-lg-4 col-6"  >
                                                <Counter end={this.state.done.length*10} unit={"tons"} icon={"icon-money"} title={"Tons of Carbon Saved"} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-6 col-12">
                                        <table className="profile-table">
                                            <tbody>
                                                <tr>
                                                    <th> Your Communities </th>
                                                    <th></th>
                                                </tr>
                                                <tr>
                                                    <td>Wayland</td>
                                                    <td><button className="remove-btn"> <i className="fa fa-trash"></i> </button></td>
                                                </tr>
                                                <tr>
                                                    <td>Concord</td>
                                                    <td><button className="remove-btn"> <i className="fa fa-trash"></i> </button></td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2}><button className="thm-btn">Join another Community</button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="col-lg-6 col-12">
                                        <table className="profile-table">
                                            <tbody>
                                                <tr>
                                                    <th> Your Households </th>
                                                    <th></th>
                                                    <th></th>
                                                </tr>
                                                <tr>
                                                    <td>Home</td>
                                                    <td><button className="edit-btn"> <i className="fa fa-edit"></i> </button></td>
                                                    <td><button className="remove-btn"> <i className="fa fa-trash"></i> </button></td>
                                                </tr>
                                                <tr>
                                                    <td>Guest</td>
                                                    <td><button className="edit-btn"> <i className="fa fa-edit"></i> </button></td>
                                                    <td><button className="remove-btn"> <i className="fa fa-trash"></i> </button></td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={3}><button className="thm-btn">Add Another Household</button></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <br />
                            <SignOutButton className="float_right" />
                        </div>
                        {/* makes the todo and completed actions carts */}
                        <div className="col-lg-4 col-md-5 col-12" style={{ paddingRight: "0px", marginRight: "0px" }}>
                        <Cart title="To Do List" actionRels={this.state.todo} status="TODO" moveToDone={this.moveToDone} />
                                        <Cart title="Completed Actions" actionRels={this.state.done} status="DONE" moveToDone={this.moveToDone} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }



    /**
     * Cart Functions
     */
    moveToDone = (actionRel) => {
        fetch(URLS.USER + "/" + this.state.user.id + "/action/" + actionRel.id, {
            method: 'post',
            body: JSON.stringify({
                status: "DONE",
                action: actionRel.action.id,
                real_estate_unit: actionRel.real_estate_unit.id,
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            console.log(json);
            if (json.success) {
                this.setState({
                    //delete from todo by filtering for not matching ids
                    todo: this.state.todo.filter(actionRel => { return actionRel.id !== json.data[0].id }),
                    //add to done by assigning done to a spread of what it already has and the one from data
                    done: [
                        ...this.state.done,
                        json.data[0]
                    ]
                })
            }
            //just update the state here
        }).catch(err => {
            console.log(err)
        })
    }
}
const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, null)(ProfilePage);