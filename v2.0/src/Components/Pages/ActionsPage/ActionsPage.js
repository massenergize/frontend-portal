import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { isLoaded } from 'react-redux-firebase'
import URLS, { getJson } from '../../api_v2';
import LoadingCircle from '../../Shared/LoadingCircle';
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
            user: null,
            actions: [],
            tagCols: [],
            todo: [],
            done: [],
            cartLoaded:false
        }
        this.handleChange = this.handleChange.bind(this);
    }
    //gets the data from the api url and puts it in pagedata and menudata
    componentDidMount() {
        Promise.all([
            getJson(URLS.USERS + "?email=" + this.props.auth.email),
            getJson(URLS.ACTIONS), //need to add community to this
            getJson(URLS.TAG_COLLECTIONS), //need to add community to this too
        ]).then(myJsons => {
            this.setState({
                ...this.state,
                user: myJsons[0].data[0],
                actions: myJsons[1].data,
                tagCols: myJsons[2].data,
                loaded:true,
            })
        }).catch(error => {
            console.log(error);
        });
    }

    loadCart() {
        Promise.all([
            getJson(URLS.USER + "/" + this.state.user.id + "/actions" + "?status=TODO"),
            getJson(URLS.USER + "/" + this.state.user.id + "/actions" + "?status=DONE"),
        ]).then(myJsons => {
            this.setState({
                todo: myJsons[0].data,
                done: myJsons[1].data,
                cartLoaded: true,
            })
            console.log(this.state);
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
            return <LoadingCircle />;
        }
        //if there is a user from the server and the cart is not loaded load the cart
        if (this.state.user && !this.state.cartLoaded) {
            this.loadCart();
            return <LoadingCircle />;
        }
        return (
            <div className="boxed_wrapper">
                {/* main shop section */}
                <div className="shop sec-padd">
                    <div className="container">
                        <div className="row">
                            {/* renders the sidebar */}
                            <div className="col-lg-4 col-md-5 col-sm-12 col-xs-12 sidebar_styleTwo">
                                <SideBar
                                    tagCols={this.state.tagCols}
                                    onChange={this.handleChange} //runs when any category is selected or unselected
                                ></SideBar>
                                {this.state.user ?
                                    <div>
                                        <Cart title="To Do List" actionRels={this.state.todo} status="TODO" moveToDone={this.moveToDone} />
                                        <Cart title="Completed Actions" actionRels={this.state.done} status="DONE" moveToDone={this.moveToDone} />
                                    </div>
                                    :
                                    <div>
                                        <p>
                                            <Link to='/login'> Sign In </Link> to add actions to your todo list or to mark them as complete
                                        </p>
                                    </div>
                                }
                            </div>
                            {/* renders the actions */}
                            <div className="col-lg-8 col-md-7 col-sm-12 col-xs-12">
                                <div className="row" id="actions-container">
                                    {this.renderActions(this.state.actions)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // on change in any category or tag checkbox update the actionsPage
    handleChange() {
        this.forceUpdate();
    }
    // renders all the actions
    renderActions(actions) {
        if (!actions) {
            return <li>No actions to Display</li>;
        }
        //returns a list of action components
        return Object.keys(actions).map(key => {
            var action = actions[key];
            return <Action key={key}
                id={action.id}
                title={action.title}
                description={action.about}
                image={action.image ? action.image.file : null}
                match={this.props.match} //passed from the Route, need to forward to the action for url matching

                tags={action.tags}
                tagCols={this.state.tagCols}

                user={this.state.user}
                addToCart={(id, status) => this.addToCart(id, status)}
                inCart={(actionId, cart) => this.inCart(actionId,cart)}
                moveToDone={(actionId) => this.moveToDoneByActionId(actionId)}
            />
        });
    }







    /**
     * These are the cart functions
     */
    inCart = (actionId, cart) => {
        console.log(cart);
        const checkTodo = this.state.todo.filter(actionRel => {return actionRel.action.id === actionId});
        if(cart==="TODO"){ return checkTodo.length > 0; } 

        const checkDone = this.state.done.filter(actionRel => {return actionRel.action.id === actionId});
        if(cart==="DONE") return checkDone.length > 0;

        return checkTodo.length >0 || checkDone.length > 0;
    }
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
            if(json.success){
                this.setState({
                    //delete from todo by filtering for not matching ids
                    todo: this.state.todo.filter(actionRel => {return actionRel.id !== json.data[0].id}), 
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
    moveToDoneByActionId(actionId){
        const actionRel = this.state.todo.filter(actionRel => {return actionRel.action.id === actionId})[0];
        if(actionRel)
            this.moveToDone(actionRel);
        
    }
    addToCart = (id, status) => {
        fetch(URLS.USER + "/" + this.state.user.id + "/actions", {
            method: 'post',
            body: JSON.stringify({
                action: id,
                status: status,
                real_estate_unit: 1
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.success) {
                //set the state here
                if(status="TODO"){
                    this.setState({
                        todo: [
                            ...this.state.todo,
                            json.data
                        ]
                    })
                }
                else if(status="DONE"){
                    this.setState({
                        done: [
                            ...this.state.done,
                            json.data
                        ]
                    })
                }
            }
        }).catch(error =>{
            console.log(error);
        });
    }
}
const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, null)(ActionsPage);
