import React from "react";
import { connect } from "react-redux";
import PageTitle from "../../Shared/PageTitle";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import LoadingCircle from "../../Shared/LoadingCircle";
import TeamStatsBars from "./TeamStatsBars";
import TeamInfoModal from "./TeamInfoModal";
import { getTeamsData, inTeam, inThisTeam } from "./utils.js";
import { Link, Redirect } from "react-router-dom";
import { getRandomIntegerInRange } from "../../Utils";
import MEButton from "./../Widgets/MEButton";
import METextField from "../Widgets/METextField";
import { apiCall } from "../../../api/functions";
import { reduxLoadTeams } from "../../../redux/actions/pageActions";
import METextView from "../Widgets/METextView";
import Tooltip from "../Widgets/CustomTooltip";
import ProductTour from "react-joyride";
import { handleTourCallback } from "../../Utils";

class TeamsPage extends React.Component {
  constructor(props) {
    super(props);
    const { teamsStats } = this.props;
    this.state = {
      searching: false,
      createTeamModalOpen: false,
      redirectID: null,
      teamsData: getTeamsData(teamsStats),
    };
  }

  handleSearch(event) {
    const { teamsData } = this.state;

    const query = event.target.value.trim();
    if (query === "" || teamsData.length === 0) {
      this.setState({ searching: false });
      return;
    }

    const match = (team) =>
      team.name.toLowerCase().includes(query.toLowerCase());

    let searchedTeamsData = [];
    for (var i = 0; i < teamsData.length; i++) {
      const subTeams = teamsData[i].subTeams;
      const newTeamData = { ...teamsData[i] };
      newTeamData.subTeams = [];

      //find matching sub teams
      if (subTeams)
        subTeams.forEach((subTeam) => {
          if (match(subTeam.team)) {
            newTeamData.subTeams.push(subTeam);
          }
        });

      //if any subteams matched, include parent in results and un-collapse it
      if (newTeamData.subTeams.length > 0) {
        newTeamData.collapsed = false;
        searchedTeamsData.push(newTeamData);
        continue;
      }

      //now check if the parent team itself matches
      if (match(newTeamData.team)) {
        searchedTeamsData.push(newTeamData);
      }
    }
    this.setState({
      searchedTeamsData: searchedTeamsData,
      searching: true,
    });
  }

  // This fxn is meant to go to the backend and collect any new changes that have happened to any
  async getAnyUpdatedTeamChanges(subdomain) {
    const body = { subdomain: subdomain };
    try {
      const response = await apiCall("teams.stats", body);
      if (response.success) {
        this.props.reduxLoadTeams(response.data);
      }
    } catch (e) {
      console.log(e.toString());
    }
  }
  componentDidMount() {
    const subdomain =
      this.props.communityData &&
      this.props.communityData.community &&
      this.props.communityData.community.subdomain;
    this.getAnyUpdatedTeamChanges(subdomain);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.teamsStats !== this.props.teamsStats) {
      this.setState({ teamsData: getTeamsData(this.props.teamsStats) });
    }
  }

  render() {
    const { teamsStats, communityData, links, pageData } = this.props;
    if (pageData == null) return <LoadingCircle />;
    if (teamsStats === null) {
      return (
        <div
          className="boxed_wrapper"
          style={{ minHeight: window.screen.height - 200 }}
        >
          <LoadingCircle />
        </div>
      );
    }
    const title =
      pageData && pageData.title
        ? pageData.title
        : "Teams in " + communityData.community.name;
    const sub_title =
      pageData && pageData.sub_title
        ? pageData.sub_title
        : "Groups collaborating: schools, congregations, neighborhoods, sports teams, and more. Get creative!";
    const description = pageData.description ? pageData.description : null;

    const { createTeamModalOpen, redirectID, teamsData } = this.state;

    const seen_tour = window.localStorage.getItem("seen_community_portal_tour");
    const steps = [
      {
        target: "body",
        title: <strong>Build community by working in teams</strong>,
        content: (
          <>
            Here’s a list of teams in your community. Join one or more by
            clicking on them, or you can start a new team.
            <br />
            <div
              style={{
                backgroundColor: "#8DC53F",
                padding: "10px",
                color: "black",
                display: "inline-block",
                borderRadius: "10px",
                marginTop: "20px",
                //TODO: I need a better option to move button to the right
                marginLeft: "380px",
              }}
            >
              <Link style={{ color: "white" }} to={this.props.links.signup}>
                Got it!
              </Link>
            </div>{" "}
          </>
        ),
        locale: {
          skip: <span>Skip Tour</span>,
          next: <span>Got it!</span>,
        },
        placement: "center",
        spotlightClicks: false,
        disableBeacon: true,
        hideFooter: true,
      },
    ];

    return (
      <>
        {seen_tour === "true" ? null : (
          <ProductTour
            steps={steps}
            showSkipButton
            //callback={handleTourCallback}
            // spotlightPadding={5}
            // disableOverlay
            // showProgress
            styles={{
              options: {
                // modal arrow and background color
                arrowColor: "#eee",
                backgroundColor: "#eee",
                // page overlay color
                // overlayColor: "transparent",
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
        )}
        ;{redirectID && <Redirect to={`${links.teams + "/" + redirectID} `} />}
        {createTeamModalOpen && (
          <TeamInfoModal
            onComplete={this.onTeamCreate}
            onClose={this.onCreateTeamModalClose}
          />
        )}
        <div
          className="boxed_wrapper"
          style={{ minHeight: window.screen.height - 200 }}
        >
          <BreadCrumbBar links={[{ name: "Teams" }]} />
          <div
            className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7 test-teams-wrapper"
            data-number-of-teams={teamsData?.length || 0}
            style={{ margin: "auto", minHeight: "100vh" }}
          >
            <div className="text-center">
              {description ? (
                <Tooltip text={description} paperStyle={{ maxWidth: "100vh" }}>
                  <PageTitle style={{ fontSize: 24 }}>
                    {title}
                    <span
                      className="fa fa-info-circle"
                      style={{ color: "#428a36", padding: "5px" }}
                    ></span>
                  </PageTitle>
                </Tooltip>
              ) : (
                <PageTitle style={{ fontSize: 24 }}>{title}</PageTitle>
              )}
            </div>

            <center>
              {sub_title ? <p className="phone-font-15">{sub_title}</p> : null}
            </center>
            <center>
              <div
                id="first-team"
                className="row no-gutters"
                style={{ marginBottom: "10px" }}
              >
                <div className="col-9">
                  <METextField
                    onChange={(event) => this.handleSearch(event)}
                    type="text"
                    placeholder="Search for a team..."
                  />
                </div>
                <METextView
                  icon="fa fa-exclamation"
                  type="small"
                  className="pc-vanish"
                  style={{
                    fontSize: 13,
                    color: "#6f3333",
                  }}
                >
                  Starting a team is not yet available in phone mode. Visit the
                  site on pc to be able to create a team
                </METextView>
                <div
                  className="col-3"
                  style={{ paddingRight: "10px", maxWidth: "20%" }}
                >
                  <MEButton
                    style={{ width: "100%", margin: 0 }}
                    onClick={() => {
                      this.setState({ createTeamModalOpen: true });
                    }}
                    className="phone-vanish"
                  >
                    Start Team
                  </MEButton>
                </div>
              </div>
            </center>

            <br />

            {teamsData.length > 0 ? (
              <>{this.renderTeams()}</>
            ) : (
              <center>
                <p className="phone-font-15 ">
                  There are no teams in this community yet. You can start one by
                  clicking the start team button above!
                </p>
              </center>
            )}
          </div>
          <br />
        </div>
      </>
    );
  }

  renderTeams() {
    const { searching, teamsData, searchedTeamsData } = this.state;
    const { user } = this.props;

    if (searching) {
      return (
        <>
          {searchedTeamsData.length > 0 ? (
            searchedTeamsData.map((teamData) => this.renderTeam(teamData))
          ) : (
            <p>No teams match your search.</p>
          )}
        </>
      );
    } else {
      if (!user) {
        return (
          <>
            <p>Click on a team below to join</p>
            {teamsData.map((teamData) => this.renderTeam(teamData))}
          </>
        );
      } else {
        const [myTeams, otherTeams] = teamsData.reduce(
          ([pass, fail], teamData) => {
            return inTeam(user, teamData)
              ? [[...pass, teamData], fail]
              : [pass, [...fail, teamData]];
          },
          [[], []]
        );

        const userInTeams = teamsData.map((teamData) => inTeam(user, teamData));

        const userInNoTeams = !userInTeams.includes(true);
        const userInAllTeams = !userInTeams.includes(false);

        let myTeamsContent;
        let otherTeamsContent;

        if (userInNoTeams) {
          myTeamsContent = (
            <p>
              You have not joined any teams. Explore the teams in this community
              below.
            </p>
          );
        } else {
          myTeams.forEach((teamData) => {
            teamData.subTeams.sort(
              (a, b) => inThisTeam(user, b.team) - inThisTeam(user, a.team)
            );
          });

          myTeamsContent = (
            <div>{myTeams.map((teamData) => this.renderTeam(teamData))}</div>
          );
        }

        if (userInAllTeams) {
          otherTeamsContent = (
            <p>You are a member of every team in this community!</p>
          );
        } else {
          otherTeamsContent = (
            <div>{otherTeams.map((teamData) => this.renderTeam(teamData))}</div>
          );
        }

        return (
          <div>
            <h3 className="teams-subheader">My Teams</h3>
            {myTeamsContent}
            <h3 className="teams-subheader">Other Teams</h3>
            {otherTeamsContent}
          </div>
        );
      }
    }
  }

  getAnimationClasses() {
    const index = getRandomIntegerInRange(3);
    const animArr = [
      "me-anime-move-from-left-fastest",
      "me-anime-move-from-left-fast",
      "me-anime-move-from-left-normal",
    ];
    return animArr[index];
  }
  renderTeam(teamData) {
    const { user } = this.props;

    const isInTeam = inTeam(user, teamData);
    const isInThisTeam = inThisTeam(user, teamData.team);

    const teamObj = teamData.team;

    return (
      <>
        <div key={teamObj.id}>
          <div className={`team-card ${this.getAnimationClasses()}`}>
            <Link
              to={`${this.props.links.teams + "/" + teamObj.id} `}
              style={{ width: "100%" }}
              className="test-team-clickable-card"
            >
              <div
                className="row no-gutter flex"
                style={{ width: "100%", height: "100%" }}
              >
                <div className="col-sm-3 team-card-column">
                  <div className="team-card-content">
                    <h4
                      className="row team-card-title"
                      style={{ marginLeft: 0, marginRight: 0 }}
                    >
                      <b>{teamObj.name}</b>
                    </h4>
                    <p
                      className="row team-card-description"
                      style={{ marginLeft: 0, marginRight: 0 }}
                    >
                      {teamObj.tagline}
                    </p>
                    {isInTeam && (
                      <p
                        className="row team-card-description"
                        style={{
                          paddingLeft: "15px",
                          paddingRight: "10px",
                          color: "#8dc63f",
                        }}
                      >
                        &#10003; in this team{" "}
                        {!isInThisTeam && "via a sub-team"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-sm-9">
                  <div className="row" style={{ margin: "0 auto" }}>
                    {teamObj.logo ? (
                      <>
                        <div className="col-8 team-card-column">
                          <TeamStatsBars
                            teamStats={teamData}
                            pref_eq={this.props.pref_eq}
                          />
                        </div>
                        <div className="col-4 team-card-column">
                          <img
                            className="team-card-img"
                            src={teamObj.logo.url}
                            alt=""
                          />
                        </div>
                      </>
                    ) : (
                      <div className="team-card-column">
                        <TeamStatsBars
                          teamStats={teamData}
                          pref_eq={this.props.pref_eq}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </div>
          {teamData.subTeams && teamData.subTeams.length > 0 && (
            <>
              <button
                className="btn round-me collapse-team-btn bottom-right z-depth-float"
                onClick={() => {
                  const { teamsData } = this.state;
                  const thisTeamIndex = teamsData.findIndex(
                    (_teamData) => _teamData.team.id === teamData.team.id
                  );
                  teamsData[thisTeamIndex].collapsed =
                    !teamsData[thisTeamIndex].collapsed;
                  this.setState({ teamsData: teamsData });
                }}
              >
                {teamData.collapsed ? (
                  <span>Expand Sub-teams &darr;</span>
                ) : (
                  <span>Collapse Sub-teams &uarr;</span>
                )}
              </button>
              {!teamData.collapsed && (
                <div className="me-sub-teams-box">
                  {teamData.subTeams.map((subTeam) => this.renderTeam(subTeam))}
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  }

  onTeamCreate = (teamID) => {
    this.setState({ createTeamModalOpen: false, redirectID: teamID });
  };

  onCreateTeamModalClose = () => {
    this.setState({ createTeamModalOpen: false });
  };
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    teamsStats: store.page.teams,
    links: store.links,
    communityData: store.page.homePage,
    pageData: store.page.teamsPage,
    pref_eq: store.user.pref_equivalence,
  };
};
const mapDispatchToProps = {
  reduxLoadTeams,
};
export default connect(mapStoreToProps, mapDispatchToProps)(TeamsPage);
