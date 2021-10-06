import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  createCircleGraphData,
  getCircleGraphData,
  calcEQ,
  PREF_EQ_DEFAULT,
} from "./../../Utils";
import { Doughnut } from "react-chartjs-2";
import Tooltip from "../Widgets/CustomTooltip";
//import Tooltip from "../../Shared/Tooltip";
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
      return <div>No Graphs to Display</div>;
    }
    const oneGraphClasses =
      "column col-lg-12 col-md-6 col-sm-6 col-xs-12 mob-homepage-chart-h";
    const twoGraphClasses =
      "column col-lg-6 col-md-6 col-sm-6 col-xs-12 mob-homepage-chart-h";
    const threeGraphClasses =
      "column col-lg-4 col-md-6 col-sm-6 col-xs-12 mob-homepage-chart-h";

    const pref_eq = this.props.pref_eq || PREF_EQ_DEFAULT;

    var classes;
    if (graphs.length === 1) classes = oneGraphClasses;
    if (graphs.length === 2) classes = twoGraphClasses;
    if (graphs.length >= 3) classes = threeGraphClasses;
    return Object.keys(graphs).map((key) => {
      let list = [
        {
          key: "households",
          unit: "Households",
          heading: "Households Taking Action",
          target: this.props.goals.target_number_of_households,
        },
        {
          key: "actions-completed",
          unit: "Actions",
          heading: "Individual Actions Completed",
          target: this.props.goals.target_number_of_actions,
        },
        {
          key: "carbon-reduction",
          unit: pref_eq.name,
          heading: "Carbon Reduction Impact",
          target: calcEQ(
            this.props.goals.target_carbon_footprint_reduction,
            pref_eq.value
          ),
        },
      ];

      const value = getCircleGraphData(
        this.props.goals,
        list[key].key,
        pref_eq
      );

      const target = list[key].target;
      const percent = target !== 0 ? parseInt((100.0 * value) / target) : 0; // to avoid "NaN%"

      return (
        <div key={key} className={classes} data-wow-duration="0ms">
          <center>
            <h4 className="impact-graph-heading">{list[key].heading}</h4>

            <Doughnut
              width={180}
              height={180}
              options={{
                plugins: { datalabels: false },
                responsive: false,
                maintainAspectRatio: false,
                legend: false,
                animation: {
                  duration: 2000,
                },
              }}
              data={createCircleGraphData(
                this.props.goals,
                list[key].key,
                pref_eq
              )}
            />

            <p className="impact-graph-title home-page-graph-tweak">
              <span
                style={{ fontSize: "1rem", color: "black", marginRight: 7 }}
              >
                <b>{Number(value).toLocaleString()}</b>
              </span>
              {list[key].unit}
              &nbsp; ({percent}% of goal)
            </p>
          </center>
        </div>
      );
    });
  }

  render() {
    // var dumbycol = "";
    // if (this.props.graphs && Object.keys(this.props.graphs).length === 2) {
    //   dumbycol = <article className={"column col-md-3"}></article>;
    // }
    return (
      <section className="fact-counter style-2 no-padd">
        <div className="text-center">
          {this.props.info ? (
            <Tooltip
              title={this.props.subtitle || "Help Us Meet Our Goals"}
              text={this.props.info}
              dir="right"
            >
              <h4
                className="section-title text-center mob-cancel-title-white me-section-title"
                style={{ fontSize: 24 }}
              >
                {this.props.subtitle || "Help Us Meet Our Goals"}
                <span
                  className="fa fa-info-circle"
                  style={{ color: "#428a36", padding: "5px" }}
                ></span>
              </h4>
            </Tooltip>
          ) : (
            <h4
              className="section-title text-center mob-cancel-title-white me-section-title"
              style={{ fontSize: 20, marginBottom: 30 }}
            >
              {this.props.subtitle || "Help Us Meet Our Goals"}
            </h4>
          )}
        </div>

        <div className="container">
          <div className="row no-gutter clearfix">
            {/* {dumbycol} */}
            {this.renderGraphs(this.props.graphs)}

            {/* <article
              className="column counter-column col-lg-3 col-md-6 col-sm-6 col-xs-12 wow fadeIn"
              data-wow-duration="0ms"
            >
              <div className="item mob-our-impact-div">
                <div className="icon"><i className="fa fa-chart-bar" /></div>
                <Link
                  to={this.props.links.impact}
                  className="thm-btn btn-finishing raise"
                >
                  Our Impact
                </Link>
                <h4 className="counter-title">about our community impact</h4>
              </div>
            </article> */}
          </div>
        </div>
        <center style={{ marginTop: 20 }}>
          <Link
            to={this.props.links.impact}
            className="homepage-all-events-btn round-me z-depth-1"
            style={{ marginTop: 20 }}
          >
            Our Impact
          </Link>
        </center>
      </section>
    );
  }
}
const mapStoreToProps = (store) => {
  return {
    links: store.links,
    pref_eq: store.user.pref_equivalence,
  };
};
export default connect(mapStoreToProps)(Graphs);
