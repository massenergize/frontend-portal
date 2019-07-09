import React from 'react';
import '../../assets/css/style.css';
import Accordian from './Accordian';

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
            const style = {
                marginLeft: "25px",
                marginBottom: "0",
                padding: "4px 0 5px 0"
            };
            return (
                <label className="checkbox-container" onClick={this.props.onChange}>
                    <p style={style}>{item.name}</p>
                    <input className="checkbox" type="checkbox" name="boxes" id={"filtertag" + item.id} value={item.name} />
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
            const header = (
                <div className="section-title w-100">
                    <span>{filter.collection}</span>
                </div>
            );
            const content = (
                <form className="list">
                    {this.renderFilter(filter.tags)}
                </form>
            );
            return (
                <div className="category-style-one">
                    <Accordian
                        header={header}
                        content = {content}
                        onChange={this.props.onChange}
                    />
                </div >
            )
    });
}
render() {
    return (
        <div className="wrapper shop-sidebar mb-5">
            <div className="sidebar_search">
                <form action="#">
                    <input type="text" placeholder="Search...." id='action-searchbar' onChange={this.props.onChange} />
                    <button className="tran3s color1_bg" onClick={this.props.onChange}><i className="fa fa-search" aria-hidden="true"></i></button>
                </form>
            </div>
            <br/>
            <h4>Filter by...</h4>
            {this.renderFilters(this.props.filters)}
        </div>
    );
}
}
export default SideBar;