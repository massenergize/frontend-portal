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
                <div className="col-md-4 col-sm-6 col-xs-12">
                    <div className="single-shop-item">
                        <div className="img-box">
                            {/* plug in the image here */}
                            <a href="shop-cart.html"><img src={this.props.image} /></a>
                            {/* animated section on top of the image */}
                            <figcaption className="overlay">
                                <div className="box">
                                    <div className="content">
                                        {/* link is thisurl/id (links to the OneActionPage) */}
                                        <a href={this.props.match.url + "/" + this.props.id}><i className="fa fa-link" aria-hidden="true"></i></a>
                                    </div>
                                </div>
                            </figcaption>
                        </div>
                        <div className="content-box">
                            <div className="inner-box">
                                <h4><a href={this.props.match.url + "/" + this.props.id}>{this.props.title}</a></h4>
                            </div>
                            {/* Impact and Difficulty tags*/}
                            <div className="price-box">
                                <div className="clearfix">
                                    <div className="float_left">
                                        <p className="action-tags"> Impact: <span>{this.props.impact}</span> </p>
                                    </div>
                                    <div className="float_right">
                                        <p className="action-tags"> Difficulty: <span>{this.props.difficulty}</span> </p>
                                    </div>
                                </div>
                            </div>
                            {/* buttons for adding todo, marking as complete and getting more info */}
                            <div className="price-box">
                                <div className="row no-gutter">
                                    <div className="col-sm-4 col-md-4 col-lg-4 col-xs-4">
                                        <a href="shop-cart.html" className="thm-btn style-4">More Info</a>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-lg-4 col-xs-4">
                                        <a href={this.props.match.url + "/" + this.props.id} className="thm-btn style-4 ">Add Todo</a>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-lg-4 col-xs-4">
                                        <a href="shop-cart.html" className="thm-btn style-4 ">Done It</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div></div>
        }
    }
    //checks the filters to see if the action should render or not
    shouldRender() {
        //need both the tags and the categories to fit and search
        //search fits if the exact string(lowercase) is in the title or description of an action //can make more advanced search later
        var searchfits = this.searchFits(this.props.title) || this.searchFits(this.props.description);
        var catsfit = this.filterFits("categories", this.props.allcategories, this.props.categories);
        var tagsfit = this.filterFits("tags", this.props.alltags, this.props.tags);
        var difficultyfits = this.filterFits("difficulties", this.props.alldifficulties, [this.props.difficulty]);
        var impactfits = this.filterFits("impacts", this.props.allimpacts, [this.props.impact]);

        return (searchfits && catsfit && tagsfit && difficultyfits && impactfits); //need the tags and the cats to fit
    }
    //checks if the value of the search bar is in the title of the action
    searchFits(string) {
        var searchbar = document.getElementById('action-searchbar');
        if (!searchbar) //if cant find the search bar just render everything
            return true;
        if (string.toLowerCase().includes(searchbar.value.toLowerCase() || searchbar.value === '')) {
            return true;
        }

        return false;
    }
    //checks if none of the boxes are checked, in which case, all the actions should show
    //takes in the name of the filter, and the filter
    noFilter(filtername, filter) {
        for (var i in filter) {
            var checkbox = document.getElementById(filtername + "-" + filter[i]);
            if (checkbox && checkbox.checked)
                return false;
        }
        return true;
    }
    //checks if any of the options are checked off in the filter
    //takes in the name of the filter, the filter and the actions' options for that filter
    filterFits(filtername, filter, options) {
        if (this.noFilter(filtername, filter)) { //if nothing is checked then just default to true
            return true;
        } else {
            for (var i in options) {
                var checkbox = document.getElementById(filtername + "-" + options[i]);
                if (checkbox && checkbox.checked) { //if the checkbox exists and is checked
                    return true;
                }
            }
        }
        return false;
    }


    //     //if the action's category is checked
    //     if (!this.props.noFilter(this.props.allcategories)) {
    //         if (document.getElementById(this.props.category) && document.getElementById(this.props.category).checked) {
    //             if (this.props.noFilter(this.props.alltags)) //if there are no tag filters
    //                 return true;
    //             for (var i in this.props.tags) { //if any of the tags are checked
    //                 if (document.getElementById(this.props.tags[i]) && document.getElementById(this.props.tags[i]).checked)
    //                     return true;
    //             }
    //         }
    //     }
    //     for (var i in this.props.tags) { //if any of the tags are checked
    //         if (document.getElementById(this.props.tags[i]) && document.getElementById(this.props.tags[i]).checked)
    //             return true;
    //     }
    //     return false;
    // }
}
export default Action;