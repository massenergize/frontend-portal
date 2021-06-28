import React from "react";
import BarGraph from "../../Shared/BarGraph";
import PageTitle from "../../Shared/PageTitle";
import ErrorPage from "./../Errors/ErrorPage";
import { connect } from "react-redux";
import LoadingCircle from "../../Shared/LoadingCircle";
import { reduxLoadCommunitiesStats } from "../../../redux/actions/pageActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import 'chartjs-plugin-datalabels';
import { Bar, Doughnut } from "react-chartjs-2";
import {createCircleGraphData} from "./../../Utils";
// TODO: Render sidebar graphs
// Replace Households Engaged by Categories with Actions Completed by Category
class ImpactPage extends React.Component {
  shortenWords(word) {
    //shorten all two-worded strings except "home energy"
    let stringArr = word.split(" ");
    if (word.toLowerCase() === "home energy") return word;
    var shortWord =  stringArr[0];
    return shortWord.replace(",",""); 
  }

  render() {
    if (!this.props.comData) {
      return <ErrorPage
        errorMessage="Data unavailable"
        errorDescription="Unable to load Impact data"
      />
    }

    const pageData = this.props.impactPage;
		if (pageData == null) return <LoadingCircle />
		const title = pageData && pageData.title ? pageData.title : "Our Community's Impact"
		//const sub_title = pageData && pageData.sub_title ? pageData.sub_title : null
		const description = pageData.description ? pageData.description : null;

    const community = this.props.community
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

    let stats = this.props.communitiesStats
      ? this.props.communitiesStats.data.slice(0)
      : [];
    stats = stats.sort((a, b) => {
      return b.actions_completed - a.actions_completed;
    });

    let phoneImpact = {
      labels: [],
      datasets: [
        {
          label: "Self Reported",
          data: [],
          backgroundColor: "rgba(251, 85, 33, 0.85)",
        },
        {
          label: "Additional State or Partner Reported",
          data: [],
          backgroundColor: "#ff9a9a",
        },
      ],
    };
    let communityImpact = {
      categories: [],
      series: [
        {
          name: "Households Engaged",
          data: [],
        },
        {
          name: "Actions Completed",
          data: [],
        },
      ],
    };
    stats.forEach((comm) => {
      communityImpact.categories.push(comm.community.name);
      communityImpact.series[0].data.push(comm.households_engaged);
      communityImpact.series[1].data.push(comm.actions_completed);
    });

    var graph2Categories = [];
    var graph2Series = [
      {
        name: "Self Reported",
        data: [],
      },
      {
        name: "Additional State or Partner Reported",
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

    return (
      <>
        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Impact" }]} />
          <div
            className="container p-5 mob-pad-0"
            style={{ background: "white" }}
          >
            <div className="row">
              <div className="col-12 col-lg-4 mob-impact-pad-fix">
                <h5
                  className="text-center"
                  style={{ color: "#888", margin: 19 }}
                >
                  {community ? community.name : null}
                </h5>
                <div
                  className="card  mb-4 z-depth-float me-anime-open-in"
                  style={{
                    borderRadius: 10,
                    background: "transparent",
                    borderColor: "#ecf3ee",
                  }}
                >
                  <div className="card-body imp-chart-h">
                    
                    <Doughnut
                    width={250}
                      height={250}
                      options={{
                        plugins:{datalabels:false},
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: false,
                        animation:{
                          duration:2000
                        }
                      }}
                      data={createCircleGraphData(goal, "households")}
                    />
                  </div>
                  <div className="imp-desc-box">
                    <center>
                      <p className="impact-graph-title">
                        <span style={{fontSize:"1rem", color:"black",marginRight:7}}>
                         <b> {goal.attained_number_of_households +
                            goal.organic_attained_number_of_households}
                            </b>
                        </span>
                        Households Engaged
                      </p>
                    </center>
                  </div>
                </div>
                <div
                  className="card z-depth-float mb-4 me-anime-open-in"
                  style={{
                    borderRadius: 10,
                    background: "transparent",
                    borderColor: "#ecf3ee",
                  }}
                >
                  <div className="card-body imp-chart-h">
                  <Doughnut
                    width={250}
                      height={250}
                      options={{
                        plugins:{datalabels:false},
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: false,
                        animation:{
                          duration:2000
                        }
                      }}
                      data={createCircleGraphData(goal, "actions-completed")}
                    />
                  </div>
                  <div className="imp-desc-box">
                    <center>
                      <p className="impact-graph-title">
                        <span style={{fontSize:"1rem", color:"black",marginRight:7}}>
                         <b> {goal.attained_number_of_actions +
                            goal.organic_attained_number_of_actions}
                            </b>
                        </span>
                        Actions Completed
                      </p>
                    </center>
                  </div>
                </div>
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
                    <Doughnut
                    width={250}
                      height={250}
                      options={{
                        plugins:{datalabels:false},
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: false,
                        animation:{
                          duration:2000
                        }
                      }}
                      data={createCircleGraphData(goal, "carbon-reduction")}
                    />
                    </div>
                    <div className="imp-desc-box">
                    <center>
                      <p className="impact-graph-title">
                        <span style={{fontSize:"1rem", color:"black",marginRight:7}}>
                         <b> {goal.attained_carbon_footprint_reduction +
                            goal.organic_attained_carbon_footprint_reduction}
                            </b>
                        </span>
                        Carbon Reduction
                      </p>
                    </center>
                  </div>
                  </div>
                ) : null}
              </div>
              <div className="col-12 col-lg-8">
                <PageTitle>{title}</PageTitle>
                <center>
						    {
							        description ?
							        <p>{description}</p>
							        :null
						    }
    						</center>

                <div className="card rounded-0 mb-4 z-depth-float" style={{ marginTop: 15, border:0 }}>
                  <div
                    className="card-header text-center bg-white "
                    style={{ marginTop: 5 }}
                  >
                    <h4 className="cool-font phone-medium-title">
                      Number Of Actions Completed
                    </h4>
                    {/* <p style={{top:240,position:'absolute',fontSize:16, transform:'rotateZ(-90deg',left:-100}}>Number Of Actions Completed</p> */}
                  </div>
                  <div className="card-body phone-vanish  me-anime-open-in">
                    <BarGraph
                      categories={graph2Categories}
                      series={graph2Series}
                      stacked={true}
                      colors={["rgba(251, 85, 33, 0.85)", "#ff9a9a"]}
                      // 86bd7d
                    />
                    {/* <center><p style={{fontSize:16,margin:0}} className="cool-font">Community Goals</p></center> */}
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
                  <Bar
                    options={{
                      plugins:{
                        datalabels:false,
                        color:"#fff"
                      },
                      maintainAspectRatio: false,
                      scales: {
                        xAxes: [{ stacked: true }],
                        yAxes: [{ stacked: true }],
                      },
                    }}
                    data={phoneImpact}
                  />
                </div>
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
    links: store.links
  };
};
export default connect(mapStoreToProps, { reduxLoadCommunitiesStats })(
  ImpactPage
);

