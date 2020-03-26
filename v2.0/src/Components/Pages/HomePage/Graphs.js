import React from 'react'
import CircleGraph from '../../Shared/CircleGraph'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'



/** Renders the graphs on the home page and a link to the impact page
 * @props :
    graphs
        data(num)
        goal
        title(label)
        size
*/


class Graphs extends React.Component {

	renderGraphs(graphs) {
	
		if (!graphs) {
			return <div>No Graphs to Display</div>
		}
		return Object.keys(graphs).map(key => {
			var graph = graphs[key];
			if (graph.data == null) {
				return <div>No Graphs to Display</div>
			} else {
				return (
					<div key={key} className="column col-lg-3 col-md-6 col-sm-6 col-xs-12 mob-homepage-chart-h" data-wow-duration="0ms">
						<CircleGraph num={graph.data.attained} goal={graph.data.target} label={graph.title} size={this.props.size} />
					</div>
				);
			}
		});
	}

	render() {
		var dumbycol = "";
		if (this.props.graphs && Object.keys(this.props.graphs).length === 2) {
			dumbycol = <article className={"column col-md-3"}></article>;
		}
		return (
			<section className="fact-counter style-2 no-padd">
				<h4 className="section-title text-center mob-cancel-title-white" style={{fontSize:20}}>Help Us Reach Our Goal</h4>
				<div className="container">
					<div className="row no-gutter clearfix">
						{dumbycol}
						{this.renderGraphs(this.props.graphs)}
						<article className="column counter-column col-lg-3 col-md-6 col-sm-6 col-xs-12 wow fadeIn" data-wow-duration="0ms">
							<div className="item mob-our-impact-div">
								{/* <div className="icon"><i className="fa fa-chart-bar" /></div> */}
								<Link to={this.props.links.impact} className="thm-btn btn-finishing raise">Our Impact</Link>
								{/* <h4 className="counter-title">about our community impact</h4> */}
							</div>
						</article>
					</div>
				</div>
			</section>
		);
	}
}
const mapStoreToProps = (store) => {
	return ({
		links: store.links
	});
}
export default connect(mapStoreToProps)(Graphs);
