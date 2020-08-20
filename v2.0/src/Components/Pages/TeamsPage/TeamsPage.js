import React from "react";
import { connect } from "react-redux";
import PageTitle from "../../Shared/PageTitle";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import LoadingCircle from "../../Shared/LoadingCircle";
import TeamStatsBars from "./TeamStatsBars";
import TeamInfoModal from "./TeamInfoModal";
import { getTeamsData, inTeam } from './utils.js';
import { Link, Redirect } from "react-router-dom";


class TeamsPage extends React.Component {
  constructor(props) {
    super(props);
    const { teamsStats } = this.props;
    this.state = {
      searching: false,
      createTeamModalOpen: false,
      redirectID: null,
      teamsData: getTeamsData(teamsStats)
    };
  }

  handleSearch(event) {

    const { teamsData } = this.state;

    const query = event.target.value.trim();
    if (query === "" || teamsData.length === 0) {
      this.setState({ searching: false });
      return;
    }

    const match = (team) => team.name.toLowerCase().includes(query.toLowerCase());


    let searchedTeamsData = [];
    for (var i = 0; i < teamsData.length; i++) {
      const subTeams = teamsData[i].subTeams;
      const newTeamData = { ...teamsData[i] };
      newTeamData.subTeams = [];

      //find matching sub teams
      if (subTeams) subTeams.forEach(subTeam => {
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


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.teamsStats !== this.props.teamsStats) {
      this.setState({ teamsData: getTeamsData(this.props.teamsStats) });
    }
  }

  render() {

    const { teamsStats } = this.props;

    if (teamsStats === null) {
      return (
        <div className="boxed_wrapper">
          <LoadingCircle />
        </div>
      );
    }

    const { createTeamModalOpen, redirectID, teamsData } = this.state;
    const { communityData, links } = this.props;

    return (
      <>

        {redirectID && <Redirect to={`${links.teams + "/" + redirectID} `} />}

        {createTeamModalOpen && <TeamInfoModal onComplete={this.onTeamCreate}
          onClose={this.onCreateTeamModalClose} />}

        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Teams" }]} />
          <div
            className="col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8"
            style={{ margin: "auto" }}
          >
            <PageTitle style={{ margin: "0 30px" }}>
              Teams in {communityData.community.name}
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
                {this.renderTeams()}
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

  renderTeams() {

    const { searching, teamsData, searchedTeamsData } = this.state;
    const { user } = this.props;

    if (searching) {

      return <>
        {searchedTeamsData.length > 0 ?
          searchedTeamsData.map((teamData) => this.renderTeam(teamData))
          :
          <p>No teams match your search.</p>
        }
      </>;

    }
    else {
      if (!user) {
        return (
          <>
            <p>Click on a team below to join it!</p>
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

  renderTeam(teamData) {
    const teamObj = teamData.team;

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
                  {teamObj.logo ? (
                    <>
                      <div className="col-8 team-card-column">
                        <TeamStatsBars teamStats={teamData} />
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
                        <TeamStatsBars teamStats={teamData} />
                      </div>
                    )}
                </div>
              </div>
            </div>
          </Link>
        </div>
        {teamData.subTeams && teamData.subTeams.length > 0 &&
          <>
            <button
              className="btn round-me collapse-team-btn bottom-right raise"
              onClick={() => {
                const { teamsData } = this.state;
                const thisTeamIndex = teamsData.findIndex
                  (_teamData => _teamData.team.id === teamData.team.id);
                teamsData[thisTeamIndex].collapsed = !teamsData[thisTeamIndex].collapsed;
                this.setState({ teamsData: teamsData });
              }}
            >
              {teamData.collapsed ? <span>Expand Sub-teams &darr;</span> : <span>Collapse Sub-teams &uarr;</span>}
            </button>
            {!teamData.collapsed &&
              <div style={{ paddingLeft: '10%', paddingTop: '10px' }}>
                {teamData.subTeams.map(subTeam => this.renderTeam(subTeam))}
              </div>
            }
          </>
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
    teamsStats: store.page.teamsPage,
    links: store.links,
    communityData: store.page.homePage,
  };
};
export default connect(mapStoreToProps, null)(TeamsPage);
