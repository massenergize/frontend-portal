import React from "react";
import { connect } from "react-redux";
import PageTitle from "../../Shared/PageTitle";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import LoadingCircle from "../../Shared/LoadingCircle";
import TeamInfoBars from "./TeamInfoBars";
import TeamInfoModal from "./TeamInfoModal";
import { processTeamsStats, inTeam } from './utils.js';
import { Link, Redirect } from "react-router-dom";


class TeamsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      createTeamModalOpen: false,
      redirectID: null,
      teamsData: processTeamsStats(this.props.teamsPage)
    };
  }

  //TODO: totally outdated. needs to look into to child teams, and update teamsInfo
  handleSearch(event) {
    const query = event.target.value.trim();
    if (query === "" || this.props.teamsPage.length === 0) {
      this.setState({ searching: false });
      return;
    }

    let allTeamStats = this.props.teamsPage;
    let searchedTeamStats = [];
    for (var i = 0; i < allTeamStats.length; i++) {
      const teamStats = allTeamStats[i];
      if (teamStats.team.name.toLowerCase().includes(query.toLowerCase())) {
        searchedTeamStats.push(teamStats);
      }
    }
    this.setState({
      searchedTeams: searchedTeamStats,
      searching: true,
    });
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.teamsPage !== this.props.teamsPage) {
      this.setState({ teamsData: processTeamsStats(this.props.teamsPage) });
    }
  }

  render() {

    if (this.props.teamsPage === null) {
      return (
        <div className="boxed_wrapper">
          <LoadingCircle />
        </div>
      );
    }

    const { createTeamModalOpen, redirectID,
      teamsData } = this.state;

    return (
      <>

        {redirectID && <Redirect to={`${this.props.links.teams + "/" + redirectID} `} />}

        {createTeamModalOpen && <TeamInfoModal onComplete={this.onTeamCreate}
          onClose={this.onCreateTeamModalClose} />}

        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Teams" }]} />
          <div
            className="col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8"
            style={{ margin: "auto" }}
          >
            <PageTitle style={{ margin: "0 30px" }}>
              Teams in {this.props.communityData.community.name}
            </PageTitle>
            <center>
              <p>
                Groups collaborating: schools, congregations, neighborhoods,
                sports teams, and more. Get creative!
              </p>

              <div className="row no-gutters" style={{ marginBottom: "10px" }}>
                <div className="col-9">
                  <input
                    onChange={(event) => this.handleSearch(event)}
                    type="text"
                    style={{ borderRadius: 0 }}
                    placeholder="Search for a team..."
                    className="teams-search round-only-left-side"
                  />
                </div>
                <div className="col-3" style={{ paddingRight: '10px' }}>
                  <button
                    style={{ width: "100%", borderRadius: 0 }}
                    className="btn start-team-btn raise round-only-right-side"
                    onClick={() => {
                      this.setState({ createTeamModalOpen: true });
                    }}
                  >
                    Start Team
                  </button>
                </div>
              </div>
            </center>

            <br />

            {teamsData.length > 0 ? (
              <>
                {this.renderTeams(teamsData)}
              </>
            ) : (
                <p>
                  There are no teams in this community yet. You can start one by
                  clicking the start team button above!
                </p>
              )}
          </div>
          <br />
        </div>
      </>
    );
  }

  renderTeams(teamsInfo) {

    //TODO: do away with "my teams" and "other teams"? add a link to user profile if someone wants to see exactly which teams they are a part of?
    //TODO: this needs to use the searching flag to render things? if searching, forget my/other teams

    const { user } = this.props;


    if (!user) {
      return (
        <>
          <p>Click on a team below to join it!</p>
          {teamsInfo.length > 0 ? (
            teamsInfo.map((teamStats) => this.renderTeam(teamStats))
          ) : (
              <p>None of the teams match your search.</p>
            )}
        </>
      );
    } else {


      const [myTeams, otherTeams] = teamsInfo.reduce(
        ([pass, fail], teamStats) => {
          return inTeam(user, teamStats)
            ? [[...pass, teamStats], fail]
            : [pass, [...fail, teamStats]];
        },
        [[], []]
      );

      const userInTeams = teamsInfo.map((teamStats) => inTeam(user, teamStats));

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
      } else if (myTeams.length > 0) {
        myTeamsContent = (
          <div>{myTeams.map((teamStats) => this.renderTeam(teamStats))}</div>
        );
      } else {
        myTeamsContent = <p>None of your teams match the search.</p>;
      }

      if (userInAllTeams) {
        otherTeamsContent = (
          <p>You are a member of every team in this community!</p>
        );
      } else if (otherTeams.length > 0) {
        otherTeamsContent = (
          <div>{otherTeams.map((teamStats) => this.renderTeam(teamStats))}</div>
        );
      } else {
        otherTeamsContent = <p>None of the other teams match the search.</p>;
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

  renderTeam(teamStats) {
    const teamObj = teamStats.team;
    const teamLogo = teamObj.logo;

    return (
      <>
        <div className="team-card" key={teamObj.id}>
          <Link
            to={`${this.props.links.teams + "/" + teamObj.id} `}
            style={{ width: "100%" }}
          >
            <div
              className="row no-gutter flex"
              style={{ width: "100%", height: "100%" }}
            >
              <div className="col-sm-3 team-card-column">
                <div className="team-card-content">
                  <h4 className="row team-card-title" style={{ marginLeft: 0, marginRight: 0 }}><b>{teamObj.name}</b></h4>
                  <p className="row team-card-description" style={{ marginLeft: 0, marginRight: 0 }}>{teamObj.tagline}</p>
                </div>
              </div>
              <div className="col-sm-9">
                <div className="row" style={{ margin: "0 auto" }}>
                  {teamLogo ? (
                    <>
                      <div className="col-8 team-card-column">
                        <TeamInfoBars teamStats={teamStats} />
                      </div>
                      <div className="col-4 team-card-column">
                        <img
                          className="team-card-img"
                          src={teamLogo.url}
                          alt=""
                        />
                      </div>
                    </>
                  ) : (
                      <div className="team-card-column">
                        <TeamInfoBars teamStats={teamStats} />
                      </div>
                    )}
                </div>
              </div>
            </div>
          </Link>
        </div>
        {teamStats.children && teamStats.children.length > 0 &&
          <button
            className="btn round-me collapse-team-btn raise"
            style={{ position: "relative", float: "right", top: '-35px', right: '20px' }}
            onClick={() => {
              const { teamsData } = this.state;
              const thisTeamIndex = teamsData.findIndex
                (teamData => teamData.team.id === teamStats.team.id);
              teamsData[thisTeamIndex].collapsed = !teamsData[thisTeamIndex].collapsed;
              this.setState({ teamsData: teamsData });
            }}
          >
            {teamStats.collapsed ? <span>See Sub-teams &darr;</span> : <span>Collapse Sub-teams &uarr;</span>}
          </button>
        }
        {teamStats.children && teamStats.children.length > 0 && !teamStats.collapsed &&
          < div style={{ paddingLeft: '45px' }}>
            {
              teamStats.children.map(child => this.renderTeam(child))
            }
          </div>
        }
      </>
    );
  }

  onTeamCreate = (teamID) => {
    this.setState({ createTeamModalOpen: false, redirectID: teamID });
  };

  onCreateTeamModalClose = () => {
    this.setState({ createTeamModalOpen: false });
  }
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    teamsPage: store.page.teamsPage,
    links: store.links,
    communityData: store.page.homePage,
  };
};
export default connect(mapStoreToProps, null)(TeamsPage);
