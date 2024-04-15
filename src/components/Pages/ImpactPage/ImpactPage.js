import React, { useState } from "react";
import BarGraph from "../../Shared/BarGraph";
import PageTitle from "../../Shared/PageTitle";
import ErrorPage from "./../Errors/ErrorPage";
import { connect } from "react-redux";
import LoadingCircle from "../../Shared/LoadingCircle";
import {
  reduxLoadCommunitiesStats,
  reduxLoadCommunityData,
  reduxLoadTagCols,
} from "../../../redux/actions/pageActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import "chartjs-plugin-datalabels";
import { HorizontalBar, Doughnut } from "react-chartjs-2";
import {
  createCircleGraphData,
  getCircleGraphData,
  calcEQ,
  PREF_EQ_DEFAULT,
} from "./../../Utils";
import { isMobile } from "react-device-detect";
import ImpactCommunityActionList from "./ImpactCommunityActionList";
import TabView from "../Widgets/METabView/METabView";
import { withRouter } from "react-router-dom";
import Seo from "../../Shared/Seo";
import { PAGE_ESSENTIALS } from "../../Constants";
import { apiCall } from "../../../api/functions";

// Replace Households Engaged by Categories with Actions Completed by Category
class ImpactPage extends React.Component {
  fetchEssentials = () => {
    const { community } = this.props;
    const { subdomain } = community || {};
    const payload = { subdomain: subdomain };

    Promise.all(
      PAGE_ESSENTIALS.IMPACT_PAGE.routes.map((route) => apiCall(route, payload))
    )
      .then((response) => {
        const [stats, tagCols, comData] = response;
        this.props.reduxLoadCommunitiesStats(stats.data);
        this.props.loadTagCollections(tagCols.data);
        this.props.loadCommunityData(comData.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  componentDidMount() {
    window.gtag("set", "user_properties", { page_title: "ImpactPage" });
    this.fetchEssentials()
  }

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
    display_prefs,
    goal,
    data,
    community,
    percents,
    carbon_units,
    values,
  }) {
    return (
      <>
        <h5 className="text-center" style={{ color: "#888", margin: 19 }}>
          {community ? community.name : null}
        </h5>
        <div id="two-graphs">
          {display_prefs.display_households ? (
            <div
              className="card  mb-4 z-depth-float me-anime-open-in"
              style={{
                borderRadius: 10,
                background: "transparent",
                borderColor: "#ecf3ee",
              }}
            >
              <div className="card-body imp-chart-h">
                <center>
                  <h4 className="impact-graph-heading">
                    Households Taking Action
                  </h4>
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
                      <b> {values[0]?.toLocaleString()}</b>
                    </span>
                    Households &nbsp; ({percents[0]}% of goal)
                  </p>
                </center>
              </div>
            </div>
          ) : null}
          {display_prefs.display_actions ? (
            <div
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
          ) : null}
        </div>
        {display_prefs.display_carbon ? (
          <div id="carbon-card">
            {goal && goal.target_carbon_footprint_reduction > 0 ? (
              <div
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
          </div>
        ) : null}
      </>
    );
  }

  makeTabs = ({ graph2Series, graph2Categories, phoneImpact }) => {
    return [
      {
        key: "graph",
        icon: "fa-bar-chart",
        name: "Graph",
        component: (
          <ImpactGraphWrapper
            graph2Categories={graph2Categories}
            graph2Series={graph2Series}
            phoneImpact={phoneImpact}
          />
        ),
      },
      {
        key: "list",
        icon: "fa-list",
        name: "List",
        component: (
          <ImpactCommunityActionList
            list={this.props.communityActionList}
            history={this.props.history}
            links={this.props.links}
          />
        ),
      },
    ];
  };
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
    const display_prefs = pageData.display_prefs;
    const title = pageData.title ? pageData.title : "Our Community's Impact";
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

    const pref_eq = this.props.pref_eq; // hardcode Tree equivalence if none chosen
    const carbon_units = pref_eq.name;

    const data = [
      createCircleGraphData(goal, "households", null),
      createCircleGraphData(goal, "actions-completed", null),
      createCircleGraphData(goal, "carbon-reduction", pref_eq),
    ];
    const values = [
      getCircleGraphData(goal, "households", null),
      getCircleGraphData(goal, "actions-completed", null),
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

    return (
      <>
        {Seo({
          title: "Impact",
          description: "",
          url: `${window.location.pathname}`,
          site_name: this.props.community?.name,
        })}
        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Impact" }]} />
          <div
            className="container p-5 mob-pad-0"
            style={{ background: "white" }}
          >
            <div className="row">
              <div className="col-12 col-lg-4 mob-impact-pad-fix phone-vanish">
                {this.renderGraphs({
                  display_prefs,
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
                  <ExplanationDialog display_prefs={display_prefs} />
                </div>

                <TabView
                  tabs={this.makeTabs({
                    graph2Categories,
                    graph2Series,
                    phoneImpact,
                  })}
                  defaultTab="graph"
                />
              </div>
              {/* ------- SHOW DOUGHNUTS HERE WHEN IN PHONE MODE ------------ */}
              {isMobile && (
                <div
                  id="tour-on-mobile"
                  className="col-12 col-lg-4 mob-impact-pad-fix pc-vanish"
                >
                  {this.renderGraphs({
                    display_prefs,
                    goal,
                    data,
                    community,
                    values,
                    percents,
                    carbon_units,
                  })}
                </div>
              )}
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
    pref_eq: store.user.pref_equivalence || PREF_EQ_DEFAULT,
    links: store.links,
    communityActionList: store.page.communityActionList,
  };
};

export default connect(mapStoreToProps, {
  reduxLoadCommunitiesStats,
  loadTagCollections: reduxLoadTagCols,
  loadCommunityData: reduxLoadCommunityData
})(withRouter(ImpactPage));

export const ImpactGraphWrapper = ({
  graph2Series,
  graph2Categories,
  phoneImpact,
}) => {
  return (
    <>
      <div
        className="card  mb-4 z-depth-float phone-vanish"
        style={{ marginTop: 15, border: 0, borderRadius: 10 }}
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

      {isMobile && (
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
      )}
    </>
  );
};
const ExplanationDialog = ({ display_prefs }) => {
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
        For an explanation of the impact graphs and data, click here.
      </a>
      {showDialog && (
        <div className="data-explanation-dialog me-anime-open-in z-depth-float">
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
            Data shown in the Actions graph comes from two sources:
          </p>
          <ol type="a">
            <li>Actions reported by community members</li>
            <li>
              Actions from State or Parner databases or previous community
              programs.
            </li>
          </ol>

          <p className="exp-title">
            Data shown in the "donut" graphs is calculated using guidance from
            the Community Admin:
          </p>
          <ol>
            {display_prefs.display_actions ? (
              <div>
                <li>
                  The Actions graph is an estimate of the number of actions
                  taken by community members. It includes:
                  <ol type="a">
                    {display_prefs.platform_actions ? (
                      <li>Actions reported by community members</li>
                    ) : null}
                    {display_prefs.state_actions ? (
                      <li>
                        Actions from State or Partner databases or previous
                        community members
                      </li>
                    ) : null}
                  </ol>
                </li>
                <br />
              </div>
            ) : null}
            {display_prefs.display_households ? (
              <div>
                <li>
                  The Households graph is an estimate of the number of
                  households that have taken action. It includes:
                  <ol type="a">
                    {display_prefs.platform_households ? (
                      <li>Households reporting actions on this website</li>
                    ) : null}
                    {display_prefs.state_households ? (
                      <li>
                        Households that installed solar arrays from the State
                        database.
                      </li>
                    ) : null}
                    {display_prefs.manual_households ? (
                      <li>
                        Households that participated in previous community
                        programs.
                      </li>
                    ) : null}
                  </ol>
                </li>
                <br />
              </div>
            ) : null}
            {display_prefs.display_carbon ? (
              <div>
                <li>
                  The Carbon Reduction graph is an estimate of the annual CO2
                  emissions reduced by the actions taken, using best available
                  data. It includes CO2 reductions from:
                  <ol type="a">
                    {display_prefs.platform_carbon ? (
                      <li>Actions reported by community members.</li>
                    ) : null}
                    {display_prefs.manual_households ? (
                      <li>Actions taken during previous community programs.</li>
                    ) : null}
                  </ol>
                </li>
              </div>
            ) : null}
          </ol>
        </div>
      )}
    </>
  );
};
