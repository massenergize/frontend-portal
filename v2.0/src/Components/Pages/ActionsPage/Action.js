import React from 'react';
import { Link } from 'react-router-dom'
import Tooltip from '../../Shared/Tooltip';
import ChooseHHForm from './ChooseHHForm'
import StoryForm from './StoryForm'

/**
 * Action Component is a single action for the action page, 
 * the action displays conditionally based on the filters on the page
 * @props : 
    "id": the actions unique id
    "title": the title of the action
    "description": a long description to be shown on more info page
    "image": action's image
    "impact": level of impact (high medium low)
    "categories": categories of the action (Home Energy, Clean Transportation...)
    "difficulty": difficulty (high medium low)
    "tags": actions' tags (sustainable, heat ...)
    "match": match is passed from Route
 */

class Action extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: null,
            showTestimonialForm: false,
            message: null,
        }
    }
    render() {
        if (!this.props.HHFormOpen && this.state.status) this.setState({ status: null });
        if (this.shouldRender()) { //checks if the action should render or not
            return (
                <div className="col-lg-6 col-md-12 col-sm-12 col-12" >
                    <div className="single-shop-item" >
                        <div className="img-box" > { /* plug in the image here */}
                            <Link to={this.props.match.url + "/" + this.props.action.id} >
                                < img src={this.props.action.image ? this.props.action.image.url : null} alt="" />
                            </Link>
                            { /* animated section on top of the image */}
                            <figcaption className="overlay" >
                                <div className="box" >
                                    <div className="content">
                                        { /* link is thisurl/id (links to the OneActionPage) */}
                                        <Link to={this.props.match.url + "/" + this.props.action.id} >
                                            <i className="fa fa-link" aria-hidden="true" ></i>
                                        </Link>
                                    </div>
                                </div>
                            </figcaption>
                        </div>
                        <div className="content-box" >
                            <div className="inner-box" >
                                <h4>
                                    <Link to={this.props.match.url + "/" + this.props.action.id}> {this.props.action.title} </Link>
                                </h4>
                            </div>
                            { /* Impact and Difficulty tags*/}
                            <div className="price-box2" >
                                <div className="clearfix" >
                                    <div className="float_left">
                                        <Tooltip text="Shows the level of impact this action makes relative to the other actions." dir="top">
                                            <span className="has-tooltip">Impact</span>
                                        </Tooltip>
                                        <span>{this.renderTagBar(this.getTag(3))}</span>
                                    </div>
                                    <div className="float_right" >
                                        Difficulty<span> {this.renderTagBar(this.getTag(2))} </span>
                                    </div>
                                </div>
                            </div>
                            { /* buttons for adding todo, marking as complete and getting more info */}
                            <div className="price-box3">
                                <div className="row no-gutter">
                                    <div className="col-sm-4 col-md-4 col-lg-4 col-4" >
                                        <div className="col-centered" >
                                            <Link to={this.props.match.url + "/" + this.props.action.id} className="thm-btn style-4" > More Info</Link>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-lg-4 col-4" >
                                        <div className="col-centered" >
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

                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-lg-4 col-4" >
                                        <div className="col-centered">
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
                                        </div>
                                    </div>
                                    <div className="col-12">

                                        <div className="col-centered">
                                            <br></br>
                                            {this.props.showTestimonialLink ?
                                                <>
                                                    {this.state.showTestimonialForm ?
                                                        <>
                                                            <button className='as-link' onClick={() => this.setState({ showTestimonialForm: false })} style={{ margin: 'auto' }}> Cancel</button>
                                                            <StoryForm aid={this.props.action.id} noMessage={true} closeForm={(message) => this.setState({ message: message, showTestimonialForm: false })}></StoryForm>
                                                        </>
                                                        :
                                                        <>
                                                            {this.state.message ?
                                                                <p>{this.state.message}</p>
                                                                :
                                                                <p>Nice job! How was your experience with this action? Tell us about it in a <button className='as-link' style={{ display: 'inline-block' }} onClick={() => this.setState({ showTestimonialForm: true })}>testimonial</button>.</p>
                                                            }
                                                        </>

                                                    }
                                                </> : null
                                            }
                                            <ChooseHHForm
                                                aid={this.props.action.id}
                                                status={this.state.status}

                                                open={this.props.HHFormOpen}
                                                user={this.props.user}
                                                addToCart={(aid, hid, status) => this.props.addToCart(aid, hid, status)}
                                                inCart={(aid, hid, cart) => this.props.inCart(aid, hid, cart)}
                                                moveToDone={(aid, hid) => this.props.moveToDone(aid, hid)}
                                                closeForm={this.closeForm}
                                            />

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    openForm = (status) => {
        this.setState({
            status: status
        })
        this.props.openHHForm(this.props.action.id)
    }
    closeForm = () => {
        this.setState({
            status: null
        })
        this.props.closeHHForm();
    }
    //checks the filters to see if the action should render or not
    shouldRender() {
        //if the search does not fit return false
        //search fits if the exact string(lowercase) is in the title or description of an action
        //can make more advanced search later
        if (!(this.searchFits(this.props.action.title) || this.searchFits(this.props.action.description)))
            return false;

        var tagSet = new Set(); //create a set of the action's tag ids
        this.props.action.tags.forEach(tag => {
            tagSet.add(tag.id);
        });

        for (var i in this.props.tagCols) {
            var tagCol = this.props.tagCols[i]; //if any filter does not fit, return false
            if (!this.filterFits(tagCol.tags, tagSet)) {
                return false;
            }
        }
        return true; //if they all fit return true
    }
    //checks if the value of the search bar is in the title of the action
    searchFits(string) {
        var searchbar = document.getElementById('action-searchbar');
        if (!searchbar || searchbar.value === '') //if cant find the search bar just render everything
            return true;
        if (!string)
            return false;
        if (string.toLowerCase().includes(searchbar.value.toLowerCase())) {
            return true;
        }
        return false;
    }
    //checks if any of the options are checked off in the filter
    //takes in the the filter and the actions' options for that filter
    filterFits(filtertags, tagSet) {
        var noFilter = true; //go through the filters and check if any of them fit or if none are checked
        for (var i in filtertags) {
            var checkbox = document.getElementById("filtertag" + filtertags[i].id);
            if (checkbox && checkbox.checked) {
                noFilter = false;
                if (tagSet.has(filtertags[i].id))
                    return true;
            }
        }
        return noFilter;
    }

    getTag(collection) {
        const tags = this.props.action.tags.filter(tag => tag.tag_collection === collection);
        return tags && tags.length > 0 ? tags[0] : null
    }

    renderTagBar(tag) {
        if (tag) {
            if (tag.name.toLowerCase() === "low" || tag.name.toLowerCase() === "easy") {
                return (
                    <div>
                        <div className="tag-bar one">
                        </div>
                    </div>
                );
            }
            if (tag.name.toLowerCase() === "medium") {
                return (
                    <div>
                        <div className="tag-bar one" />
                        <div className="tag-bar two" />
                    </div>
                );
            }
            if (tag.name.toLowerCase() === "high" || tag.name.toLowerCase() === "hard") {
                return (
                    <div>
                        <div className="tag-bar one" > </div>
                        <div className="tag-bar two" > </div>
                        <div className="tag-bar three" > </div>
                    </div>
                );
            }
        }
        return null;
    }
}
export default Action;