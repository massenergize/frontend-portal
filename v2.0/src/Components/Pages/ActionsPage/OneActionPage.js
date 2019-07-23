import React from 'react'
import URLS, { getJson } from '../../api_v2';
import LoadingCircle from '../../Shared/LoadingCircle';
import { isLoaded } from 'react-redux-firebase';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Cart from '../../Shared/Cart';

/**
 * This page displays a single action and the cart of actions that have been added to todo and have been completed
 * @props : match.params.id: the id of the action from the url params match is from Route
 */
class OneActionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            user: null,
            action: null, 
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
            getJson(URLS.ACTION + "/" + this.props.match.params.id), //need to add community to this
            getJson(URLS.TAG_COLLECTIONS), //need to add community to this too
        ]).then(myJsons => {
            this.setState({
                ...this.state,
                user: myJsons[0].data[0],
                action: myJsons[1].data,
                tagCols: myJsons[2].data,
                loaded: true,
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
        if (!isLoaded(this.props.auth)) { //if the auth isn't loaded wait for a bit
            return <LoadingCircle />;
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

                <section className="shop-single-area">
                    <div className="container">
                        <div className="row" style={{ paddingRight: "0px", marginRight: "0px" }}>
                            <div className="col-md-8">
                                <div className="single-products-details">
                                    {this.renderAction(this.state.action)}
                                </div>
                            </div>
                            {/* makes the todo and completed actions carts */}
                            {this.state.user ?
                                <div className="col-md-4" style={{ paddingRight: "0px", marginRight: "0px" }}>
                                    <Cart title="To Do List" actionRels={this.state.todo} status="TODO" moveToDone={this.moveToDone} />
                                    <Cart title="Completed Actions" actionRels={this.state.done} status="DONE" moveToDone={this.moveToDone} />
                                </div>
                                :
                                <div className="col-md-4" style={{ paddingRight: "0px", marginRight: "0px" }}>
                                    <p>
                                        <Link to='/login'> Sign In </Link> to add actions to your todo list or to mark them as complete
                                    </p>
                                </div>
                            }
                        </div>
                    </div>
                </section>

            </div>
        );
    }
    /**
     * renders the action on the page
     * @param {render} actions  the list of actions to search through
     * @param {*} id            the id of the action we are going to diplay
     */
    renderAction(action) {
        return (
            <div>
                <div className="product-content-box">
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            {/* title */}
                            <div className="content-box">
                                <h2 style={{ padding: "20px 0px 0px 0px" }}>{action.title}</h2>
                            </div>
                            <br />
                            {/* displays the action's info: impact, difficulty, tags and categories*/}
                            <div className="clearfix" style={{ marginLeft: "40px" }}>
                                <p className="action-tags" style={{ fontSize: "20px" }}> Tags: <br />
                                    {this.renderTags(action.tags)}
                                </p>
                                {/* the buttons to add todo or done it */}
                                {!this.inCart(action.id) ?
                                    <button
                                        disabled={!this.state.user}
                                        className="thm-btn style-4 "
                                        style={{ fontSize: "15px", marginRight: "20px" }}
                                        onClick={() => this.addToCart(action.id, "TODO")}
                                    >Add Todo</button>
                                    : null
                                }
                                {!this.inCart(action.id) ?
                                    <button
                                        disabled={!this.state.user}
                                        className="thm-btn style-4 "
                                        style={{ fontSize: "15px" }}
                                        onClick={() => this.addToCart(action.id, "DONE")}
                                    >Done It</button>
                                    :
                                    <>{!this.inCart(action.id, "DONE") ?
                                        <button
                                            disabled={!this.state.user}
                                            className="thm-btn style-4 "
                                            style={{ fontSize: "15px" }}
                                            onClick={() => this.moveToDoneByActionId(action.id)}
                                        >Done It</button>
                                        : null
                                    }
                                    </>
                                }
                            </div>
                        </div>
                        {/* action image */}
                        <div className="col-lg-6 col-md-12"><div className="img-box">
                            <img src={action.image ? action.image.file : null} alt="" data-imagezoom="true" className="img-responsive" style={{ marginTop: "20px" }} />
                        </div></div>
                    </div>
                </div>
                {/* tab box holding description, steps to take, and stories about the action */}
                <div className="product-tab-box">
                    <ul className="nav nav-tabs tab-menu">
                        {/* tab switching system, may be a better way to do this */}
                        <li id="desctab" className="active"><button onClick={() => {
                            if (document.getElementById("desc")) document.getElementById("desc").className = "tab-pane active";
                            if (document.getElementById("review")) document.getElementById("review").className = "tab-pane";
                            if (document.getElementById("steps")) document.getElementById("steps").className = "tab-pane";
                            if (document.getElementById("desctab")) document.getElementById("desctab").className = "active";
                            if (document.getElementById("reviewtab")) document.getElementById("reviewtab").className = "";
                            if (document.getElementById("stepstab")) document.getElementById("stepstab").className = "";
                        }} data-toggle="tab">Description</button></li>
                        <li id="stepstab"><button onClick={() => {
                            if (document.getElementById("desc")) document.getElementById("desc").className = "tab-pane";
                            if (document.getElementById("review")) document.getElementById("review").className = "tab-pane";
                            if (document.getElementById("steps")) document.getElementById("steps").className = "tab-pane active";
                            if (document.getElementById("desctab")) document.getElementById("desctab").className = "";
                            if (document.getElementById("reviewtab")) document.getElementById("reviewtab").className = "";
                            if (document.getElementById("stepstab")) document.getElementById("stepstab").className = "active";
                        }} data-toggle="tab">Steps to Take</button></li>
                        <li id="reviewtab"><button onClick={() => {
                            if (document.getElementById("desc")) document.getElementById("desc").className = "tab-pane";
                            if (document.getElementById("review")) document.getElementById("review").className = "tab-pane active";
                            if (document.getElementById("steps")) document.getElementById("steps").className = "tab-pane";
                            if (document.getElementById("desctab")) document.getElementById("desctab").className = "";
                            if (document.getElementById("reviewtab")) document.getElementById("reviewtab").className = "active";
                            if (document.getElementById("stepstab")) document.getElementById("stepstab").className = "";
                        }} data-toggle="tab">Stories </button></li>{/**@TODO make it say number of stories/disapear if none*/}
                    </ul>
                    <div className="tab-content">
                        {/* description */}
                        <div className="tab-pane active" id="desc">
                            <div className="product-details-content">
                                <div className="desc-content-box">
                                    <p>{action.about}</p>
                                </div>
                            </div>
                        </div>
                        {/* steps to take */}
                        <div className="tab-pane" id="steps">
                            <div className="product-details-content">
                                <div className="desc-content-box">
                                    <p>{action.steps_to_take}</p>
                                </div>
                            </div>
                        </div>
                        {/* Reviews */}
                        <div className="tab-pane" id="review">
                            <div className="review-box">
                                <div className="tab-title-h4">
                                    <h4>2 Reviews For Bedroom Lamp</h4>
                                </div>
                                {/* <!--Start single review box--> */}
                                <div className="single-review-box">
                                    <div className="img-holder">
                                        <img src="images/shop/thumb1.jpg" alt="" />
                                    </div>
                                    <div className="text-holder">
                                        <div className="top">
                                            <div className="name pull-left">
                                                <h4>Steven Rich – Sep 17, 2016:</h4>
                                            </div>
                                            <div className="review-box pull-right">
                                                <ul>
                                                    <li><i className="fa fa-star"></i></li>
                                                    <li><i className="fa fa-star"></i></li>
                                                    <li><i className="fa fa-star"></i></li>
                                                    <li><i className="fa fa-star"></i></li>
                                                    <li><i className="fa fa-star"></i></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="text">
                                            <p>How all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings.</p>
                                        </div>
                                    </div>
                                </div>
                                {/* <!--End single review box-->    */}

                                {/* <!--Start single review box--> */}
                                <div className="single-review-box">
                                    <div className="img-holder">
                                        <img src="images/shop/thumb2.jpg" alt="" />
                                    </div>
                                    <div className="text-holder">
                                        <div className="top">
                                            <div className="name pull-left">
                                                <h4>William Cobus – Aug 21, 2016:</h4>
                                            </div>
                                            <div className="review-box pull-right">
                                                <ul>
                                                    <li><i className="fa fa-star"></i></li>
                                                    <li><i className="fa fa-star"></i></li>
                                                    <li><i className="fa fa-star"></i></li>
                                                    <li><i className="fa fa-star"></i></li>
                                                    <li><i className="fa fa-star"></i></li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="text">
                                            <p>there anyone who loves or pursues or desires to obtain pain itself, because it is pain, but because occasionally circumstances occur some great pleasure.</p>
                                        </div>
                                    </div>
                                </div>
                                {/* <!--End single review box-->    */}
                            </div>
                            {/* form to fill out to tell your own story */}
                            <div className="review-form">
                                <div className="tab-title-h4">
                                    <h4>Add Your Own Story</h4>
                                </div>
                                <form action="#">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="field-label">
                                                <p>First Name*</p>
                                                <input type="text" name="fname" placeholder="" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="field-label">
                                                <p>Last Name*</p>
                                                <input type="text" name="lname" placeholder="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="field-label">
                                                <p>Email*</p>
                                                <input type="text" name="email" placeholder="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="field-label">
                                                <p>Your Review*</p>
                                                <textarea name="review" placeholder=""></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button className="thm-btn bg-cl-1" type="submit">Submit Now</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderTags(tags) {
        return Object.keys(tags).map((key) => {
            return <span key={key}> {tags[key].name} </span>;
        })
    }
    // on change in any category or tag checkbox update the actionsPage
    handleChange() {
        this.forceUpdate();
    }













    /**
     * These are the Cart functions
     */

    inCart = (actionId, cart) => {
        console.log(cart);
        const checkTodo = this.state.todo.filter(actionRel => { return actionRel.action.id === actionId });
        if (cart === "TODO") { return checkTodo.length > 0; }

        const checkDone = this.state.done.filter(actionRel => { return actionRel.action.id === actionId });
        if (cart === "DONE") return checkDone.length > 0;

        return checkTodo.length > 0 || checkDone.length > 0;
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
    moveToDoneByActionId(actionId) {
        const actionRel = this.state.todo.filter(actionRel => { return actionRel.action.id === actionId })[0];
        if (actionRel)
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
                if (status = "TODO") {
                    this.setState({
                        todo: [
                            ...this.state.todo,
                            json.data
                        ]
                    })
                }
                else if (status = "DONE") {
                    this.setState({
                        done: [
                            ...this.state.done,
                            json.data
                        ]
                    })
                }
            }
        }).catch(error => {
            console.log(error);
        });
    }
}
const mapStoreToProps = (store) => {
    return {
        auth: store.firebase.auth
    }
}
export default connect(mapStoreToProps, null)(OneActionPage);