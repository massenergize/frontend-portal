import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import URLS from '../../../api/urls';
import { getJson, postJson } from '../../../api/functions'
import {reduxAddToDone, reduxAddToTodo, reduxMoveToDone} from '../../../redux/actions/userActions'
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
            tagCols: [],
            openAddForm: null,
        }
        this.handleChange = this.handleChange.bind(this);
    }
    // //gets the data from the api url and puts it in pagedata and menudata
    componentDidMount() {
        Promise.all([
            // getJson(URLS.USERS + "?email=" + this.props.auth.email),
            // getJson(URLS.ACTIONS), //need to add community to this
            getJson(URLS.TAG_COLLECTIONS), //need to add community to this too
        ]).then(myJsons => {
            this.setState({
                ...this.state,
                // user: myJsons[0].data[0],
                // actions: myJsons[1].data,
                tagCols: myJsons[0].data,
                loaded: true,
            })
        }).catch(error => {
            console.log(error);
        });
    }

    // loadCart() {
    //     Promise.all([
    //         getJson(URLS.USER + "/" + this.props.user.id + "/actions" + "?status=TODO"),
    //         getJson(URLS.USER + "/" + this.props.user.id + "/actions" + "?status=DONE"),
    //     ]).then(myJsons => {
    //         this.setState({
    //             todo: myJsons[0].data,
    //             done: myJsons[1].data,
    //             cartLoaded: true,
    //         })
    //     }).catch(err => {
    //         console.log(err)
    //     });
    // }

    render() {
        //avoids trying to render before the promise from the server is fulfilled
        // if (!isLoaded(this.props.auth)) { //if the auth isn't loaded wait for a bit
        //     return <LoadingCircle />;
        // }
        //if the auth is loaded and there is a user logged in but the user has not been fetched from the server remount
        // if (isLoaded(this.props.auth) && this.props.auth.uid && !this.props.user) {
        //     this.componentDidMount();
        //     return <LoadingCircle />;
        // }
        //if there is a user from the server and the cart is not loaded load the cart
        // if (this.props.user && !this.state.cartLoaded) {
        //     this.loadCart();
        //     return <LoadingCircle />;
        // }
        if(!this.state.loaded)
            return <LoadingCircle/>;
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
                                {this.props.user ?
                                    <div>
                                        <Cart title="To Do List" actionRels={this.props.todo} status="TODO" moveToDone={this.moveToDone} />
                                        <Cart title="Completed Actions" actionRels={this.props.done} status="DONE" moveToDone={this.moveToDone} />
                                    </div>
                                    :
                                    <div>
                                        <p>
                                            <Link to={`/login?returnpath=${this.props.match.url}`}> Sign In </Link> to add actions to your todo list or to mark them as complete
                                        </p>
                                    </div>
                                }
                            </div>
                            {/* renders the actions */}
                            <div className="col-lg-8 col-md-7 col-sm-12 col-xs-12">
                                <div className="row" id="actions-container">
                                    {this.renderActions(this.props.actions)}
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
                action={action}

                // id={action.id}
                // title={action.title}
                // description={action.about}
                // image={action.image ? action.image.url : null}
                // tags={action.tags}

                tagCols={this.state.tagCols}
                match={this.props.match} //passed from the Route, need to forward to the action for url matching
                user={this.props.user}

                addToCart={(aid, hid, status) => this.addToCart(aid, hid, status)}
                inCart={(aid, hid, cart) => this.inCart(aid, hid, cart)}
                moveToDone={(actionId) => this.moveToDoneByActionId(actionId)}

                HHFormOpen = {this.state.openAddForm === action.id}
                closeHHForm = {() => this.setState({ openAddForm: null })}
                openHHForm = {(aid) => this.setState({ openAddForm: aid})}
            />
        });
    }

    /**
     * These are the cart functions
     */
    inCart = (aid, hid, cart) => {
        console.log("huh");
        if(!this.props.todo) return false;
        const checkTodo = this.props.todo.filter(actionRel => { return actionRel.action.id === aid && actionRel.real_estate_unit.id === hid });
        if (cart === "TODO") { return checkTodo.length > 0; }

        if(!this.props.done) return false;
        const checkDone = this.props.done.filter(actionRel => { return actionRel.action.id === aid && actionRel.real_estate_unit.id === hid });
        if (cart === "DONE") return checkDone.length > 0;

        return checkTodo.length > 0 || checkDone.length > 0;
    }
    moveToDone = (actionRel) => {
        const body = {
            status: "DONE",
            action: actionRel.action.id,
            real_estate_unit: actionRel.real_estate_unit.id,
        }
        postJson(URLS.USER+'/'+this.props.user.id+'/action/'+actionRel.id ,body).then(json => {
            console.log(json);
            if (json.success) {
                this.props.reduxMoveToDone(json.data);
            }
            //just update the state here
        }).catch(err => {
            console.log(err)
        })
    }
    moveToDoneByActionId(aid, hid) {
        const actionRel = this.props.todo.filter(actionRel => { return actionRel.action.id === aid && actionRel.real_estate_unit.id === hid })[0];
        if (actionRel)
            this.moveToDone(actionRel);

    }
    addToCart = (aid,hid, status) => {
        const body = {
            action: aid,
            status:status,
            real_estate_unit: hid
        }
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
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }
}
const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth,
        user: store.user.info,
        todo: store.user.todo,
        done: store.user.done,
        actions: store.page.actions,
        pageData: store.page.actionsPage
    }
}

const mapDispatchToProps = {reduxAddToDone, reduxAddToTodo, reduxMoveToDone}
export default connect(mapStoreToProps, mapDispatchToProps)(ActionsPage);
