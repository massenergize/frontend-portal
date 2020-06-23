import React from "react";
import { connect } from "react-redux";
import PageTitle from '../../Shared/PageTitle';
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import LoadingCircle from "../../Shared/LoadingCircle";
import TeamInfoBars from "./TeamInfoBars";
import { Link } from "react-router-dom";

class TeamsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchedTeams: [],
      searching: false,
      joiningTeamID: null
    }
  }

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
      searching: true
    });
  }


  render() {
    const teamsStats = this.props.teamsPage;
    if (teamsStats === null) {
      return (
        <div className="boxed_wrapper">
          <LoadingCircle />
        </div>
      );
    }

    return (
      <>

        <div className="boxed_wrapper">

          <BreadCrumbBar links={[{ name: "Teams" }]} />
          <div className='col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8' style={{ margin: 'auto' }}>

            <PageTitle style={{ margin: "0 30px" }}>Teams in {this.props.communityData.community.name}</PageTitle>
            <center>
              <p>
                Teams are groups in a community who want to collaborate. They
                can represent a school, congregation, group of neighbors, or sports team. Get
                creative!
              </p>
              <div className='col-12 col-sm-10'>
                <input onChange={event => this.handleSearch(event)} type="text" placeholder="Search for a team..." className="teams-search" />
              </div>
            </center>
            {teamsStats.length > 0 ?
              <>
                {
                  this.state.searching ?
                    this.renderTeams(this.state.searchedTeams)
                    :
                    this.renderTeams(teamsStats)
                }
              </>
              :
              <p>There are no teams in this community yet. You can start one by clicking the start team button at the bottom of the page!</p>
            }
          </div>
          <br />
          <center>
            <button
              className="btn btn-success round-me start-team-btn raise"
              onClick={() => {
                //TODO
              }}
            >
              Start a Team
              </button>
            <Link to={`${this.props.links.teams + "/compare"}`}>
              <button className="btn btn-success round-me comp-teams-btn raise">
                Compare Teams
              </button>
            </Link>
          </center>
          <br />
        </div>
      </>
    );
  }

  renderTeams(teamsStats) {

    if (!this.props.user) {
      return (
        <>
          <p>Click on a team below to join it!</p>
          <hr></hr>
          {teamsStats.length > 0 ?
            teamsStats.map(teamStats => this.renderTeam(teamStats))
            :
            <p>None of the teams match your search.</p>
          }
        </>
      )

    } else {

      const [myTeams, otherTeams] = teamsStats.reduce(([pass, fail], team) => {
        return this.inTeam(team.team.id) ? [[...pass, team], fail] : [pass, [...fail, team]];
      }, [[], []]);
      const userInNoTeams = !(this.props.teamsPage.map(teamStats => this.inTeam(teamStats.team.id)).includes(true));
      const userInAllTeams = !(this.props.teamsPage.map(teamStats => this.inTeam(teamStats.team.id)).includes(false));

      let myTeamsContent;
      let otherTeamsContent;

      if (userInNoTeams) {
        myTeamsContent = <p>You have not joined any teams. Explore the teams in this community below.</p>;
      } else if (myTeams.length > 0) {
        myTeamsContent = <div>
          {myTeams.map(teamStats => this.renderTeam(teamStats))}
        </div>;
      } else {
        myTeamsContent = <p>None of your teams match the search.</p>;
      }

      if (userInAllTeams) {
        otherTeamsContent = <p>You are a member of every team in this community!</p>;
      } else if (otherTeams.length > 0) {
        otherTeamsContent = <div>
          {otherTeams.map(teamStats => this.renderTeam(teamStats))}
        </div>;
      } else {
        otherTeamsContent = <p>None of the other teams match the search.</p>;
      }

      return (
        <div>
          <h3 className="teams-subheader">My Teams</h3>
          {myTeamsContent}
          <hr></hr>
          <h3 className="teams-subheader">Other Teams</h3>
          {otherTeamsContent}
        </div >
      );
    }
  }

  renderTeam(teamStats) {
    const teamObj = teamStats.team;
    const teamLogo = teamObj.logo;

    //to be replaced by a team tagline, inherently limited to some amount of characters
    const teamDescription = teamObj.description.length > 70 ?
      teamObj.description.substring(0, 70) + "..."
      : teamObj.description;

    return (
      <div className="team-card" key={teamObj.id}>
        <Link to={`${this.props.links.teams + "/" + teamObj.id} `} style={{ width: '100%' }}>
          <div className="row no-gutter flex" style={{ width: '100%', height: '100%' }}>
            <div className="col-sm-3 team-card-column">
              <div className="team-card-content">
                <h4 className="row team-card-title" style={{ marginLeft: 0, marginRight: 0 }}><b>{teamObj.name}</b></h4>
                <p className="row team-card-description" style={{ marginLeft: 0, marginRight: 0 }}>{teamDescription}</p>
              </div>
            </div>
            <div className="col-sm-9">
              <div className="row" style={{ margin: '0 auto' }}>
                {teamLogo ?
                  <>
                    <div className="col-8 team-card-column">
                      <TeamInfoBars teamStats={teamStats} />
                    </div>
                    <div className="col-4 team-card-column">
                      <img className='team-card-img' src={teamLogo.url} alt="" />
                    </div>
                  </>
                  :
                  <div className="team-card-column">
                    <TeamInfoBars teamStats={teamStats} />
                  </div>
                }
              </div>
            </div>
          </div>
        </Link>
      </div >
    );
  }

  inTeam = (team_id) => {
    if (!this.props.user) {
      return false;
    }
    return (
      this.props.user.teams.filter((team) => {
        return team.id === team_id;
      }).length > 0
    );
  };

}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    teamsPage: store.page.teamsPage,
    links: store.links,
    communityData: store.page.homePage
  };
};
export default connect(mapStoreToProps, null)(TeamsPage);
