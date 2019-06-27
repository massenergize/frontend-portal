import React from 'react';
import '../assets/css/style.css';

/** Renders the sidebar on the actions page, optons to filter by category, tags, difficulty and impact
 *  @props
    categories
    tags
*/
class SideBar extends React.Component {
    renderFilter(filtername,filter) {
        if (!filter) {
            return <li>Nothing to Display</li>;
        }
        console.log(filtername);
        return Object.keys(filter).map(key => {
            var item = filter[key];
            return (
                <label className="checkbox-container" onClick={this.props.onChange}>
                    <p style={{marginLeft:"25px"}}>{item}</p>
                    <input className="checkbox" type="checkbox" name="boxes" id={filtername+"-"+item} value={item}/>
                    <span className="checkmark"></span>
                </label>
            );
        });
    }
    render() {
        return (
            <div className="col-md-3 col-sm-12 col-xs-12 sidebar_styleTwo">
                <div className="wrapper shop-sidebar">
                    <div className="sidebar_search">
                        <form action="#">
                            <input type="text" placeholder="Search...." id='action-searchbar' onChange={this.props.onChange}/>
                            <button className="tran3s color1_bg" onClick={this.props.onChange}><i className="fa fa-search" aria-hidden="true"></i></button>
                        </form>
                    </div> <br /><br />
                    <div className="category-style-one">
                        <div className="section-title style-2">
                            <h4>Categories</h4>
                        </div>
                        <form className="list">
                            {this.renderFilter("categories",this.props.categories)}
                        </form>
                    </div>
                    <div className="category-style-one">
                        <div className="section-title style-2">
                            <h4>Product Tags</h4>
                        </div>
                        <form className="list">
                            {this.renderFilter("tags",this.props.tags)}
                        </form>
                    </div>
                    <div className="category-style-one">
                        <div className="section-title style-2">
                            <h4>Difficulty</h4>
                        </div>
                        <form className="list">
                            {this.renderFilter("difficulties",this.props.difficulties)}
                        </form>
                    </div>
                    <div className="category-style-one">
                        <div className="section-title style-2">
                            <h4>Impact</h4>
                        </div>
                        <form className="list" id="impacts">
                            {this.renderFilter("impacts",this.props.impacts)}
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
export default SideBar;