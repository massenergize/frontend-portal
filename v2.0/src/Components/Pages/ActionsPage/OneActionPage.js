import React from 'react'
import URLS from '../../../api/urls';
import { postJson } from '../../../api/functions'
import LoadingCircle from '../../Shared/LoadingCircle';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Cart from '../../Shared/Cart';
import StoryForm from './StoryForm';
import ChooseHHForm from './ChooseHHForm';
import { reduxAddToDone, reduxAddToTodo, reduxMoveToDone } from '../../../redux/actions/userActions'
import Tooltip from '../../Shared/Tooltip'


/**
 * This page displays a single action and the cart of actions that have been added to todo and have been completed
 * @props : match.params.id: the id of the action from the url params match is from Route
 */
class OneActionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
        }
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        window.addEventListener("resize", this.chooseFontSize);
    }

    render() {
        if (!this.props.actions) {
            return <LoadingCircle />;
        }
        const action = this.props.actions.filter(action => {
            return action.id === Number(this.props.match.params.id)
        })[0]
        this.chooseFontSize();
        return (
            <div className="boxed_wrapper">
                <section className="shop-single-area">
                    <div className="container">
                        <div className="row" style={{ paddingRight: "0px", marginRight: "0px" }}>
                            <div className="col-md-8">
                                <div className="single-products-details">
                                    {this.renderAction(action)}
                                </div>
                            </div>
                            {/* makes the todo and completed actions carts */}
                            {this.props.user ?
                                <div className="col-md-4" style={{ paddingRight: "0px", marginRight: "0px" }}>
                                    <Cart title="To Do List" actionRels={this.props.todo} status="TODO" moveToDone={this.moveToDone} />
                                    <Cart title="Completed Actions" actionRels={this.props.done} status="DONE" moveToDone={this.moveToDone} />
                                </div>
                                :
                                <div className="col-md-4" style={{ paddingRight: "0px", marginRight: "0px" }}>
                                    <p>
                                        <Link to={`/login?returnpath=${this.props.match.url}`}> Sign In </Link> to add actions to your todo list or to mark them as complete
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
     */
    renderAction(action) {
        if (!this.props.stories) {
            return <LoadingCircle />
        }
        const stories = this.props.stories.filter(story => {
            return story.action.id === Number(this.props.match.params.id)
        })
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
                                <br />
                                {!this.props.user ?
                                    <Tooltip text='Sign in to make a TODO list'>
                                        <p className='has-tooltip thm-btn style-4 disabled'>
                                            Add Todo
                                                    </p>
                                    </Tooltip>
                                    :
                                    <button
                                        className={this.state.status === "TODO" ? "thm-btn style-4 selected" : "thm-btn style-4"}
                                        onClick={() => this.openForm("TODO")}
                                    > Add Todo </button>
                                }
                                &nbsp;
                                {!this.props.user ?
                                    <Tooltip text='Sign in to mark actions as completed'>
                                        <p className='has-tooltip thm-btn style-4 disabled'>
                                            Done It
                                                    </p>
                                    </Tooltip>
                                    :
                                    <button
                                        className={this.state.status === "DONE" ? "thm-btn style-4 selected" : "thm-btn style-4"}
                                        onClick={() => this.openForm("DONE")}
                                    > Done It </button>
                                }
                                {this.state.status ?
                                    <div style={{ paddingTop: '20px' }}>
                                        <ChooseHHForm
                                            aid={action.id}
                                            status={this.state.status}

                                            open={this.state.status ? true : false}
                                            user={this.props.user}
                                            addToCart={(aid, hid, status) => this.addToCart(aid, hid, status)}
                                            inCart={(aid, hid, cart) => this.inCart(aid, hid, cart)}
                                            moveToDone={(aid, hid) => this.moveToDoneByActionId(aid, hid)}
                                            closeForm={this.closeForm}
                                        /> </div>
                                    : null
                                }

                            </div>
                        </div>
                        {/* action image */}
                        <div className="col-lg-6 col-md-12"><div className="img-box">
                            <img src={action.image ? action.image.url : null} alt="" data-imagezoom="true" className="img-responsive" style={{ marginTop: "20px" }} />
                        </div></div>
                    </div>
                </div>
                {/* tab box holding description, steps to take, and stories about the action */}
                <div className="product-tab-box">
                    <ul className="nav nav-tabs tab-menu">
                        {/* tab switching system, may be a better way to do this */}
                        <li id="desctab" className="active"><button style={{ fontSize: this.state.fontSize }} onClick={() => {
                            if (document.getElementById("desc")) document.getElementById("desc").className = "tab-pane active";
                            if (document.getElementById("review")) document.getElementById("review").className = "tab-pane";
                            if (document.getElementById("steps")) document.getElementById("steps").className = "tab-pane";
                            if (document.getElementById("desctab")) document.getElementById("desctab").className = "active";
                            if (document.getElementById("reviewtab")) document.getElementById("reviewtab").className = "";
                            if (document.getElementById("stepstab")) document.getElementById("stepstab").className = "";
                        }} data-toggle="tab">Description</button></li>
                        <li id="stepstab"><button style={{ fontSize: this.state.fontSize }} onClick={() => {
                            if (document.getElementById("desc")) document.getElementById("desc").className = "tab-pane";
                            if (document.getElementById("review")) document.getElementById("review").className = "tab-pane";
                            if (document.getElementById("steps")) document.getElementById("steps").className = "tab-pane active";
                            if (document.getElementById("desctab")) document.getElementById("desctab").className = "";
                            if (document.getElementById("reviewtab")) document.getElementById("reviewtab").className = "";
                            if (document.getElementById("stepstab")) document.getElementById("stepstab").className = "active";
                        }} data-toggle="tab">Steps to Take</button></li>
                        <li id="reviewtab"><button style={{ fontSize: this.state.fontSize }} onClick={() => {
                            if (document.getElementById("desc")) document.getElementById("desc").className = "tab-pane";
                            if (document.getElementById("review")) document.getElementById("review").className = "tab-pane active";
                            if (document.getElementById("steps")) document.getElementById("steps").className = "tab-pane";
                            if (document.getElementById("desctab")) document.getElementById("desctab").className = "";
                            if (document.getElementById("reviewtab")) document.getElementById("reviewtab").className = "active";
                            if (document.getElementById("stepstab")) document.getElementById("stepstab").className = "";
                        }} data-toggle="tab">Testimonials </button></li>{/**@TODO make it say number of stories/disapear if none*/}
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
                        <div className="tab-pane" id="review">
                            <div className="review-box">
                                {/* Reviews */}
                                {this.renderStories(stories)}
                            </div>
                            {/* form to fill out to tell your own story */}
                            {this.props.user ?
                                <StoryForm uid={this.props.user.id} aid={action.id} addStory={this.addStory} />
                                :
                                <p>
                                    <Link to={`/login?returnpath=${this.props.match.url}`}> Sign In </Link> to submit your own story about taking this Action
                            </p>
                            }
                        </div>

                    </div>
                </div>
            </div>
        );
    }
    chooseFontSize = () => {
        var fontSize = '16px'
        if (window.innerWidth < 500) {
            fontSize = '12px';
        }
        if (fontSize !== this.state.fontSize) {
            this.setState({
                fontSize: fontSize
            })
        }
    }
    openForm = (status) => {
        this.setState({
            status: status
        })
    }
    closeForm = () => {
        this.setState({
            status: null
        })
    }

    renderTags(tags) {
        console.log(tags);
        return Object.keys(tags).map((key) => {
            return <span key={key}> {tags[key].name} </span>;
        })
    }
    addStory = (story) => {
        this.setState({
            stories: [
                ...this.props.stories,
                story
            ]
        })
    }
    renderStories(stories) {
        if (stories.length === 0)
            return <p> No stories about this action yet </p>;
        return (
            <>
                {/* <div className="tab-title-h4">
                    <h4>{stories.length} Stories about this Action</h4>
                </div> */}
                {Object.keys(stories).map((key) => {
                    const story = stories[key];
                    const date = new Date(story.created_at);
                    return (
                        <div className="single-review-box" key={key}>
                            <div className="img-holder">
                                <img src="" alt="" />
                            </div>
                            <div className="text-holder">
                                <div className="top">
                                    <div className="name pull-left">
                                        <h4>{story.user.full_name} – {date.toLocaleDateString()}:</h4>
                                    </div>
                                </div>
                                <div className="text">
                                    <h6>{story.title}</h6>
                                    <p>{story.body}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    }
    // on change in any category or tag checkbox update the actionsPage
    handleChange() {
        this.forceUpdate();
    }
    /**
     * These are the Cart functions
     */

    /**
     * These are the cart functions
     */
    inCart = (aid, hid, cart) => {
        if (!this.props.todo) return false;
        const checkTodo = this.props.todo.filter(actionRel => { return Number(actionRel.action.id) === Number(aid) && Number(actionRel.real_estate_unit.id) === Number(hid) });
        if (cart === "TODO") { return checkTodo.length > 0; }

        if (!this.props.done) return false;
        const checkDone = this.props.done.filter(actionRel => { return Number(actionRel.action.id) === Number(aid) && Number(actionRel.real_estate_unit.id) === Number(hid) });
        if (cart === "DONE") return checkDone.length > 0;

        return checkTodo.length > 0 || checkDone.length > 0;
    }
    moveToDone = (actionRel) => {
        const body = {
            status: "DONE",
            action: actionRel.action.id,
            real_estate_unit: actionRel.real_estate_unit.id,
        }
        postJson(URLS.USER + '/' + this.props.user.id + '/action/' + actionRel.id, body).then(json => {
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
        const actionRel = this.props.todo.filter(actionRel => {
            return Number(actionRel.action.id) === Number(aid) && Number(actionRel.real_estate_unit.id) === Number(hid)
        })[0];
        console.log(actionRel);
        if (actionRel)
            this.moveToDone(actionRel);

    }
    addToCart = (aid, hid, status) => {
        const body = {
            action: aid,
            status: status,
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
        stories: store.page.testimonials
    }
}
const mapDispatchToProps = { reduxAddToDone, reduxAddToTodo, reduxMoveToDone }

export default connect(mapStoreToProps, mapDispatchToProps)(OneActionPage);