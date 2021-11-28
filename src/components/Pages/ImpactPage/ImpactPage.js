import React, { useState } from "react";
import BarGraph from "../../Shared/BarGraph";
import PageTitle from "../../Shared/PageTitle";
import ErrorPage from "./../Errors/ErrorPage";
import { connect } from "react-redux";
import LoadingCircle from "../../Shared/LoadingCircle";
import { reduxLoadCommunitiesStats } from "../../../redux/actions/pageActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import "chartjs-plugin-datalabels";
import { HorizontalBar, Doughnut } from "react-chartjs-2";
import {
  createCircleGraphData,
  getCircleGraphData,
  calcEQ,
  PREF_EQ_DEFAULT,
} from "./../../Utils";
import ProductTour from "react-joyride";
import { Link } from "react-router-dom";

// TODO: Render sidebar graphs
// Replace Households Engaged by Categories with Actions Completed by Category
class ImpactPage extends React.Component {
  shortenWords(word) {
    //shorten all two-worded strings except "home energy"
    let stringArr = word.split(" ");
    if (word.toLowerCase() === "home energy") return word;
    var shortWord = stringArr[0];
    return shortWord.replace(",", "");
  }

  makeDoughnut(data, options = {}) {
    const _options = {
      plugins: { datalabels: false },
      responsive: false,
      maintainAspectRatio: false,
      legend: false,
      animation: {
        duration: 2000,
      },
      ...options,
    };
    return (
      <Doughnut
        options={_options}
        data={(canvas) => {
          canvas.height = 1000;
          canvas.width = 1000;
          canvas.style.height = "200px";
          canvas.style.width = "200px";
          canvas.style.marginLeft = "40px";
          return data;
        }}
      />
    );
  }
  renderGraphs({
    goal,
    data,
    community,
    percents,
    carbon_units,
    values,
    maintainAspectRatio = false,
  }) {
    return (
      <>
        <h5 className="text-center" style={{ color: "#888", margin: 19 }}>
          {community ? community.name : null}
        </h5>
        <div
          id="hh-card"
          className="card  mb-4 z-depth-float me-anime-open-in"
          style={{
            borderRadius: 10,
            background: "transparent",
            borderColor: "#ecf3ee",
          }}
        >
          <div className="card-body imp-chart-h">
            <center>
              <h4 className="impact-graph-heading">Households Taking Action</h4>
            </center>
            {this.makeDoughnut(data[0])}
          </div>
          <div className="imp-desc-box">
            <center>
              <p className="impact-graph-title">
                <span
                  style={{
                    fontSize: "1rem",
                    color: "black",
                    marginRight: 7,
                  }}
                >
                  <b> {values[0].toLocaleString()}</b>
                </span>
                Households &nbsp; ({percents[0]}% of goal)
              </p>
            </center>
          </div>
        </div>
        <div
          id="card-individual-actions"
          className="card z-depth-float mb-4 me-anime-open-in"
          style={{
            borderRadius: 10,
            background: "transparent",
            borderColor: "#ecf3ee",
          }}
        >
          <div className="card-body imp-chart-h">
            <center>
              <h4 className="impact-graph-heading">
                Individual Actions Completed
              </h4>
            </center>
            {this.makeDoughnut(data[1])}
          </div>
          <div className="imp-desc-box">
            <center>
              <p className="impact-graph-title">
                <span
                  style={{
                    fontSize: "1rem",
                    color: "black",
                    marginRight: 7,
                  }}
                >
                  <b> {values[1].toLocaleString()}</b>
                </span>
                Actions &nbsp; ({percents[1]}% of goal)
              </p>
            </center>
          </div>
        </div>
        {goal && goal.target_carbon_footprint_reduction > 0 ? (
          <div
            id="carbon-card"
            className="card z-depth-float mb-4 me-anime-open-in"
            style={{
              borderRadius: 10,
              background: "transparent",
              borderColor: "#ecf3ee",
            }}
          >
            <div className="card-body imp-chart-h">
              <center>
                <h4 className="impact-graph-heading">
                  Carbon Reduction Impact
                </h4>
              </center>
              {this.makeDoughnut(data[2])}
            </div>
            <div className="imp-desc-box">
              <center>
                <p className="impact-graph-title">
                  <span
                    style={{
                      fontSize: "1rem",
                      color: "black",
                      marginRight: 7,
                    }}
                  >
                    <b> {values[2].toLocaleString()}</b>
                  </span>
                  {carbon_units}
                  &nbsp; ({percents[2]}% of goal)
                </p>
              </center>
            </div>
          </div>
        ) : null}
      </>
    );
  }
  render() {
    if (!this.props.comData) {
      return (
        <ErrorPage
          errorMessage="Data unavailable"
          errorDescription="Unable to load Impact data"
        />
      );
    }

    const pageData = this.props.impactPage;
    if (pageData == null) return <LoadingCircle />;
    const title =
      pageData && pageData.title ? pageData.title : "Our Community's Impact";
    //const sub_title = pageData && pageData.sub_title ? pageData.sub_title : null
    const description = pageData.description ? pageData.description : null;

    const community = this.props.community;
    const goal = this.props.community ? this.props.community.goal : null;
    const completed = this.props.communityData
      ? this.props.communityData.data
      : [];
    if (!this.props.tagCols || !this.props.communityData)
      return <LoadingCircle />;
    if (!this.props.communityData || this.props.communityData.length === 0) {
      return (
        <div className="boxed_wrapper">
          <h2
            className="text-center"
            style={{
              color: "#9e9e9e",
              margin: "190px 150px",
              padding: "30px",
              border: "solid 2px #fdf9f9",
              borderRadius: 10,
            }}
          >
            {" "}
            :({" "}
          </h2>
        </div>
      );
    }

    let phoneImpact = {
      labels: [],
      datasets: [
        {
          label: "Self Reported",
          data: [],
          backgroundColor: "rgba(251, 85, 33, 0.85)",
        },
        {
          label: "State or Partner Reported",
          data: [],
          backgroundColor: "#ff9a9a",
        },
      ],
    };

    var graph2Categories = [];
    var graph2Series = [
      {
        name: "Self Reported",
        data: [],
      },
      {
        name: "State or Partner Reported",
        data: [],
      },
    ];

    completed.forEach((el) => {
      if (el) {
        graph2Categories.push(this.shortenWords(el.name));
        graph2Series[0].data.push(el.value);
        graph2Series[1].data.push(el.reported_value);
        phoneImpact.labels.push(this.shortenWords(el.name));
        phoneImpact.datasets[0].data.push(el.value);
        phoneImpact.datasets[1].data.push(el.reported_value);
      }
    });

    const pref_eq = this.props.pref_eq || PREF_EQ_DEFAULT; // hardcode Tree equivalence if none chosen
    const carbon_units = pref_eq.name;

    const data = [
      createCircleGraphData(goal, "households"),
      createCircleGraphData(goal, "actions-completed"),
      createCircleGraphData(goal, "carbon-reduction", pref_eq),
    ];
    const values = [
      getCircleGraphData(goal, "households"),
      getCircleGraphData(goal, "actions-completed"),
      getCircleGraphData(goal, "carbon-reduction", pref_eq),
    ];
    const percents = [
      parseInt((100 * values[0]) / goal.target_number_of_households),
      parseInt((100 * values[1]) / goal.target_number_of_actions),
      parseInt(
        (100 * values[2]) /
          calcEQ(goal.target_carbon_footprint_reduction, pref_eq.value)
      ),
    ];
    const steps = [
      {
        target: "#hh-card",
        title: "Join your neighbors taking actions",
        content: (
          <>
            Many households are already part of this community. People around
            your neighborhood can colaborate and make an impact together.
            <br />
            <div
              style={{
                backgroundColor: "#8DC53F",
                padding: "10px",
                color: "black",
                display: "inline-block",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            >
              <Link style={{ color: "white" }} to={this.props.links.teams}>
                Got it!
              </Link>
            </div>{" "}
          </>
        ),
        locale: {
          skip: <span>Skip Tour</span>,
          next: <span>Next!</span>,
        },
        placement: "auto",
        spotlightClicks: true,
        disableBeacon: true,
        hideFooter: false,
      },
      {
        target: "#carbon-card",
        title: "Your actions help reduce carbon emissions", //this copy needs change
        content: (
          <>
            Your carbon footprint is tied to your activities. This community
            helps you find people with similar interests and increase your CO2
            savings.
            <br />
            <div
              style={{
                backgroundColor: "#8DC53F",
                padding: "10px",
                color: "black",
                display: "inline-block",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            >
              <Link style={{ color: "white" }} to={this.props.links.teams}>
                Got it!
              </Link>
            </div>
          </>
        ),
        placement: "auto",
        spotlightClicks: true,
        disableBeacon: true,
        hideFooter: true,
      },
    ];

    return (
      <>
        <ProductTour
          steps={steps}
          continuous
          showSkipButton
          spotlightPadding={30}
          // disableOverlay
          // showProgress
          styles={{
            options: {
              // modal arrow and background color
              arrowColor: "#eee",
              backgroundColor: "#eee",
              // page overlay color
              //  overlayColor: "rgba(79, 26, 0, 0.1)",
              //button color
              primaryColor: "#8CC43C",
              //text color
              textColor: "black",
              //width of modal
              width: 500,
              //zindex of modal
              zIndex: 1000,
            },
          }}
        />
        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Impact" }]} />
          <div
            className="container p-5 mob-pad-0"
            style={{ background: "white" }}
          >
            <div className="row">
              <div className="col-12 col-lg-4 mob-impact-pad-fix phone-vanish">
                {this.renderGraphs({
                  goal,
                  data,
                  community,
                  values,
                  percents,
                  carbon_units,
                  maintainAspectRatio: true,
                })}
              </div>
              <div className="col-12 col-lg-8">
                <PageTitle className="imp-title">{title}</PageTitle>
                <center>
                  {description ? (
                    <p
                      style={{ color: "black", textAlign: "justify" }}
                      className="imp-phone-desc"
                    >
                      {description}
                    </p>
                  ) : null}
                </center>
                <div style={{ padding: 10 }}>
                  <ExplanationDialog />
                </div>
                <div
                  className="card rounded-0 mb-4 z-depth-float phone-vanish"
                  style={{ marginTop: 15, border: 0 }}
                >
                  <div
                    className="card-header text-center bg-white "
                    style={{ marginTop: 5 }}
                  >
                    <h4 className="cool-font phone-medium-title">
                      Number Of Actions Completed
                    </h4>
                  </div>
                  <div className="card-body   me-anime-open-in">
                    {/* ------- BAR GRAPH BY APEXCHARTS  ON PC -------- */}
                    <BarGraph
                      categories={graph2Categories}
                      series={graph2Series}
                      stacked={false}
                      colors={["rgba(251, 85, 33, 0.85)", "#ff9a9a"]}
                    />
                  </div>
                </div>

                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "46vh",
                    padding: 10,
                    marginBottom: 25,
                  }}
                  className=" pc-vanish"
                >
                  <div
                    className="card-header text-center bg-white "
                    style={{ marginTop: 5 }}
                  >
                    <h4 className="cool-font phone-medium-title">
                      Number Of Actions Completed
                    </h4>
                  </div>
                  {/* ------------ BAR GRAPH BY REACT JS 2 , ON MOBILE ( Cos its more responsive) */}
                  <HorizontalBar
                    options={{
                      plugins: {
                        datalabels: false,
                        color: "#fff",
                      },
                      maintainAspectRatio: false,
                      scales: {
                        xAxes: [{ stacked: false }],
                        yAxes: [{ stacked: false }],
                      },
                    }}
                    data={phoneImpact}
                  />
                </div>
              </div>
              {/* ------- SHOW DOUGHNUTS HERE WHEN IN PHONE MODE ------------ */}
              <div className="col-12 col-lg-4 mob-impact-pad-fix pc-vanish">
                {this.renderGraphs({
                  goal,
                  data,
                  community,
                  values,
                  percents,
                  carbon_units,
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStoreToProps = (store) => {
  return {
    communitiesStats: store.page.communitiesStats,
    communityData: store.page.communityData,
    tagCols: store.page.tagCols,
    comData: store.page.homePage,
    community: store.page.community,
    impactPage: store.page.impactPage,
    pref_eq: store.user.pref_equivalence,
    links: store.links,
  };
};

export default connect(mapStoreToProps, { reduxLoadCommunitiesStats })(
  ImpactPage
);

const ExplanationDialog = () => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <a
        href="#void"
        style={{
          width: "100%",
          textAlign: "center",
          color: "green",
          marginBottom: 8,
          textDecoration: "underline",
        }}
        onClick={(e) => {
          e.preventDefault();
          setShowDialog(true);
        }}
      >
        Dont know what the graph means? See explanation here.
      </a>
      {showDialog && (
        <div className="data-explanation-dialog">
          <div style={{ display: "flex", width: "100%" }}>
            <i
              onClick={() => setShowDialog(false)}
              className="fa fa-times-circle"
              style={{
                fontSize: 24,
                marginLeft: "auto",
                color: "var(--app-theme-orange)",
                cursor: "pointer",
              }}
            />
          </div>
          <p className="exp-title">
            Data shown in the graph comes from two sources:
          </p>
          <ol>
            <li>
              Data collected on the platform from community members who have
              taken actions
            </li>
            <li>
              Data entered by Community Admins for reported actions from State
              or Partner databases, or from previous community programs.
            </li>
          </ol>

          <p className="exp-title">
            On the Community impact totals (donut graphs):
          </p>
          <ol>
            <li>
              The Actions Completed graph shows the sum of self reported and
              state/partner data. In some cases, there may be double counting
            </li>
            <li>
              The Households Engaged is an estimate. Communities sum up self
              reported households, plus the number of actions completed in the
              category with the largest number of state/partner values, and
              added community engagement efforts (plus community specific
              campaign efforts)
            </li>
            <li>
              The Carbon Reduction graph (if shown) shows the estimated
              reduction for actions taken on the platform, which currently use
              Massachusetts averages for those actions. It may also include
              estimated carbon reduction from reported State/Partner data or
              previous programs, if that is provided by the Community Admin.
            </li>
          </ol>
        </div>
      )}
    </>
  );
};
