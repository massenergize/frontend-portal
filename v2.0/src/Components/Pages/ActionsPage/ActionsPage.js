import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {isLoaded} from 'react-redux-firebase'
import URLS, { getJson } from '../../api_v2';
import LoadingCircle from '../../Shared/LoadingCircle';
import SideBar from '../../Menu/SideBar';
import Action from './Action';
import Cart from '../../Shared/Cart'



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
                loaded: true,
                user: myJsons[0].data[0],
                actions: myJsons[1].data,
                tagCols: myJsons[2].data,
            })
        }).catch(error => {
            console.log(error);
            return null;
        });
    }

    render() {
        //avoids trying to render before the promise from the server is fulfilled
        if (!isLoaded(this.props.auth) || !this.state.loaded) return <LoadingCircle />;
        if (this.props.auth && !this.state.user)
            this.componentDidMount();
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
                                        <Cart title="To Do List" uid={this.state.user.id} status="TODO"/>
                                        <Cart title="Completed Actions" uid={this.state.user.id} status="DONE" />
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
                image={action.image ? action.image.file : ""}
                match={this.props.match} //passed from the Route, need to forward to the action for url matching

                tags={action.tags}
                tagCols={this.state.tagCols}

                user={this.state.user}
                addToCart = {(id,status) => this.addToCart(id,status)}
            />
        });
    }
    addToCart = (id, status)  => {
        fetch(URLS.USER+"/"+this.state.user.id+"/actions", {
            method:'post',
            body: JSON.stringify({
                action: id,
                status: status,
                real_estate_unit: 1
            })
        
        }).then(response =>{
            return response.json()
        }).then(json=>{
            if(json.success){
                this.componentDidMount()
            }
        });
    }
}
const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, null)(ActionsPage);
