import React from 'react';
import '../assets/css/style.css';

/* @props
    categories
    tags
*/
class SideBar extends React.Component {
    renderTags(tags) {
        if (!tags) {
            return <li>No tags to Display</li>;
        }
        return Object.keys(tags).map(key => {
            var tag = tags[key];
            return <li><a href={""} className="tran3s">{tag}</a></li>;
        });
    }
    renderCategories(categories) {
        if (!categories) {
            return <li>No categories to Display</li>
        }
        return Object.keys(categories).map(key => {
            var category = categories[key];
            return <li><a href={"?category=" + category}>{category}</a></li>
        });
    }
    render() {
        return (
            <div className="col-md-3 col-sm-12 col-xs-12 sidebar_styleTwo">
                <div className="wrapper shop-sidebar">
                    <div className="sidebar_search">
                        <form action="#">
                            <input type="text" placeholder="Search...." />
                            <button className="tran3s color1_bg"><i className="fa fa-search" aria-hidden="true"></i></button>
                        </form>
                    </div> <br /><br />

                    <div className="category-style-one">
                        <div className="section-title style-2">
                            <h4>Categories</h4>
                        </div>
                        <ul className="list">
                            {this.renderCategories(this.props.categories)}
                        </ul>
                    </div>

                    {/* <div className="price_filter wow fadeInUp">
                        <div className="section-title style-2">
                            <h4>Filter By Price</h4>
                        </div>
                        <div className="single-sidebar price-ranger">
                            <div id="slider-range"></div>
                            <div className="ranger-min-max-block">
                                <input type="submit" value="Filter"/>
                                <span>Price:</span>
                                <input type="text" readonly className="min"/> 
                                <span>-</span>
                                <input type="text" readonly className="max"/>
                            </div>
                        </div> 
                    </div>  */}

                    {/* <div className="best_sellers clearfix wow fadeInUp">
                        <div className="section-title style-2">
                            <h4>Best Sellers</h4>
                        </div>
                        <div className="best-selling-area">
                            <div className="best_selling_item clearfix border">
                                <div className="img_holder float_left">
                                    <a href="shop-single.html"><img src="images/shop/11.jpg" alt="image" /></a>
                                </div>

                                <div className="text float_left">
                                    <a href="shop-single.html"><h4>The Innovators</h4></a>
                                    <span>$34.99</span>
                                    <ul>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star-half-o" aria-hidden="true"></i></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="best_selling_item clearfix border">
                                <div className="img_holder float_left">
                                    <a href="shop-single.html"><img src="images/shop/12.jpg" alt="image" /></a>
                                </div>
                                <div className="text float_left">
                                    <a href="shop-single.html"><h4>Good to Great</h4></a>
                                    <span>$24.00</span>
                                    <ul>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="best_selling_item clearfix">
                                <div className="img_holder float_left">
                                    <a href="shop-single.html"><img src="images/shop/13.jpg" alt="image" /></a>
                                </div>

                                <div className="text float_left">
                                    <a href="shop-single.html"><h4>Built to Last</h4></a>
                                    <span>$20.00</span>
                                    <ul>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star" aria-hidden="true"></i></li>
                                        <li><i className="fa fa-star-o" aria-hidden="true"></i></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div> */}


                    <div className="sidebar_tags wow fadeInUp">
                        <div className="section-title style-2">
                            <h4>Product Tags</h4>
                        </div>

                        <ul>
                            {this.renderTags(this.props.tags)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
export default SideBar;