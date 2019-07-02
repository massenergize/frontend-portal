import React from 'react';
import '../assets/css/style.css';

/** Renders the sidebar on the actions page, optons to filter by category, tags, difficulty and impact
 *  @props
    taggroups list
    @TODO need to update how this takes in input, should take in a json with a list of tag titles with sub tags in them
    need to make the tags accordian dropdown
*/
class SideBar extends React.Component {

    renderFilter(filter) {
        if (!filter) {
            return <p>No Filter Available</p>;
        }
        return Object.keys(filter).map(key => {
            var item = filter[key];
            return (
                <label className="checkbox-container" onClick={this.props.onChange}>
                    <p style={{ marginLeft: "25px" }}>{item.name}</p>
                    <input className="checkbox" type="checkbox" name="boxes" id={"filtertag"+item.id} value={item.name} />
                    <span className="checkmark"></span>
                </label>
            );
        });
    }

    renderFilters(filters) {
        if (!filters) {
            return <p>No Filters Available</p>;
        }
        return Object.keys(filters).map(key => {
            var filter = filters[key];
            return (
                <div className="category-style-one">
                    <div className="section-title style-2">
                        <h4>{filter.collection}</h4>
                    </div>
                    <form className="list">
                        {this.renderFilter(filter.tags)}
                    </form>
                </div>
            )
        });
    }
    render() {
        return (
            <div className="wrapper shop-sidebar">
                <div className="sidebar_search">
                    <form action="#">
                        <input type="text" placeholder="Search...." id='action-searchbar' onChange={this.props.onChange} />
                        <button className="tran3s color1_bg" onClick={this.props.onChange}><i className="fa fa-search" aria-hidden="true"></i></button>
                    </form>
                </div>
                {this.renderFilters(this.props.filters)}
                {/* <div className="category-style-one">
                    <div className="section-title style-2">
                        <h4>Categories</h4>
                    </div>
                    <form className="list">
                        {this.renderFilter("categories", this.props.categories)}
                    </form>
                </div>
                <div className="category-style-one">
                    <div className="section-title style-2">
                        <h4>Product Tags</h4>
                    </div>
                    <form className="list">
                        {this.renderFilter("tags", this.props.tags)}
                    </form>
                </div>
                <div className="category-style-one">
                    <div className="section-title style-2">
                        <h4>Difficulty</h4>
                    </div>
                    <form className="list">
                        {this.renderFilter("difficulties", this.props.difficulties)}
                    </form>
                </div>
                <div className="category-style-one">
                    <div className="section-title style-2">
                        <h4>Impact</h4>
                    </div>
                    <form className="list" id="impacts">
                        {this.renderFilter("impacts", this.props.impacts)}
                    </form>
                </div> */}
            </div>
        );
    }
}
export default SideBar;