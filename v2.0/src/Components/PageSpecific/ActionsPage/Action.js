import React from 'react';

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
    render() {
        if (this.shouldRender()) { //checks if the action should render or not
            return (
                <div className="col-lg-4 col-md-6 col-sm-6 col-6" >
                    <div className="single-shop-item" >
                        <div className="img-box" > { /* plug in the image here */}
                            <a href="shop-cart.html" >
                                < img src={this.props.image} />
                            </a>
                            { /* animated section on top of the image */}
                            <figcaption className="overlay" >
                                <div className="box" >
                                    <div className="content">
                                        { /* link is thisurl/id (links to the OneActionPage) */}
                                        <a href={this.props.match.url + "/" + this.props.id} >
                                            <i className="fa fa-link" aria-hidden="true" ></i>
                                        </a>
                                    </div>
                                </div>
                            </figcaption>
                        </div>
                        <div className="content-box" >
                            <div className="inner-box" >
                                <h4>
                                    <a href={this.props.match.url + "/" + this.props.id}> {this.props.title} </a>
                                </h4>
                            </div>
                            { /* Impact and Difficulty tags*/}
                            <div className="price-box2" >
                                <div className="clearfix" >
                                    <div className="float_left">
                                        <p>Impact:<span>{this.renderTagBar(this.getTag("impacts"))}</span></p>
                                    </div>
                                    <div className="float_right" >
                                        <p> Difficulty:<span> {this.renderTagBar(this.getTag("difficulties"))} </span></p>
                                    </div>
                                </div>
                            </div>
                            { /* buttons for adding todo, marking as complete and getting more info */}
                            <div className="price-box3">
                                <div className="row no-gutter">
                                    <div className="col-sm-4 col-md-4 col-lg-4 col-4" >
                                        <div className="col-centered" >
                                            <a href={this.props.match.url + "/" + this.props.id} className="thm-btn style-4" > More Info</a>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-lg-4 col-4" >
                                        <div className="col-centered" >
                                            <a href="addtodo" className="thm-btn style-4 " > Add Todo </a>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-lg-4 col-4" >
                                        <div className="col-centered">
                                            <a href="addtodone" className="thm-btn style-4 "> Done It </a>
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
    //checks the filters to see if the action should render or not
    shouldRender() {
        //if the search does not fit return false
        //search fits if the exact string(lowercase) is in the title or description of an action
        //can make more advanced search later
        if (!(this.searchFits(this.props.title) || this.searchFits(this.props.description)))
            return false;

        var tagSet = new Set(); //create a set of the action's tag ids
        this.props.tags.forEach(tag => {
            tagSet.add(tag.id);
        });

        for (var i in this.props.filters) {
            var filter = this.props.filters[i]; //if any filter does not fit, return false
            if (!this.filterFits(filter.tags, tagSet)) {
                return false;
            }
        }
        return true; //if they all fit return true
    }
    //checks if the value of the search bar is in the title of the action
    searchFits(string) {
        var searchbar = document.getElementById('action-searchbar');
        if (!searchbar) //if cant find the search bar just render everything
            return true;
        if (searchbar.value === '' || string.toLowerCase().includes(searchbar.value.toLowerCase())) {
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
        for (var i in this.props.tags) {
            var tag = this.props.tags[i];
            if (tag.collection === collection)
                return tag.name;
        }
        return "";
    }

    renderTagBar(tag) {
        if (tag === "Low") {
            return (
                <div>
                    <div className="tag-bar one">
                    </div>
                </div>
            );
        }
        if (tag === "Medium") {
            return (
                <div>
                    <div className="tag-bar one" />
                    <div className="tag-bar two" />
                </div>
            );
        }
        if (tag === "High") {
            return (
                <div>
                    <div className="tag-bar one" > </div>
                    <div className="tag-bar two" > </div>
                    <div className="tag-bar three" > </div>
                </div>
            );
        }
    }
}
export default Action;