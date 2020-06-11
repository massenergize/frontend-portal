import React from "react";
import { connect } from "react-redux";
import PageTitle from '../../Shared/PageTitle';
import { apiCall } from "../../../api/functions";
import {
  reduxJoinTeam
} from "../../../redux/actions/userActions";
import {
  reduxAddTeamMember
} from "../../../redux/actions/pageActions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import LoadingCircle from "../../Shared/LoadingCircle";
import TeamInfoBars from "./TeamInfoBars";

class TeamsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchedTeams: [],
      searching: false
    }
  }

  handleSearch(event) {
    const query = event.target.value.trim();
    if (query === "") {
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

            <PageTitle style={{ margin: "0 30px" }}>Teams in this Community</PageTitle>
            <center>
              <p>
                Teams are groups in a community that wants to collaborate. It
                could be a school, congregation, a group of neighbors or friends, a sports team. Get
                creative!
              </p>
              <div>
                <button
                  className="btn btn-success round-me start-team-btn raise"
                  onClick={() => {
                    //TODO
                  }}
                >
                  Start a Team
              </button>
                <button
                  className="btn btn-success round-me comp-teams-btn raise"
                  onClick={() => {
                    window.location = `${this.props.links.teams + "/compare"}`;
                  }}
                >
                  Compare Teams
              </button>
              </div>
              <div className='col-12 col-sm-10'>
                <input onChange={event => this.handleSearch(event)} type="text" placeholder="Search for a team..." className="teams-search" />
              </div>
            </center>
            <br />
            {this.state.searching ?
              this.renderTeams(this.state.searchedTeams)
              :
              this.renderTeams(teamsStats)
            }
          </div>
        </div>
      </>
    );
  }

  renderTeams(teamsStats) {

    if (this.state.searching) {
      return (
        <div>
          <h3 className="teams-subheader">Search Results</h3>
          {teamsStats.length > 0 ?
            <div>
              {teamsStats.map(teamStats => this.renderTeam(teamStats))}
            </div>
            :
            <p>There are no teams which match your search.</p>
          }
        </div>
      );
    }

    if (teamsStats.length === 0) {
      return <p>There are no teams in this community yet. You can start one by clicking the "Start a Team" button above!</p>
    }

    const [myTeams, otherTeams] = teamsStats.reduce(([pass, fail], team) => {
      return this.inTeam(team.team.id) ? [[...pass, team], fail] : [pass, [...fail, team]];
    }, [[], []]);

    return (
      <div>
        <h3 className="teams-subheader">My Teams</h3>
        {myTeams.length > 0 ?
          <div>
            {myTeams.map(teamStats => this.renderTeam(teamStats))}
          </div>
          :
          <>{
            this.props.user ?
              <p>You have not joined any teams. Explore the teams in this community below.</p>
              :
              <p>You must sign in to view your teams.</p>
          }
          </>
        }
        <hr></hr>
        <h3 className="teams-subheader">Other Teams</h3>
        {
          otherTeams.length > 0 ?
            <div>
              {otherTeams.map(teamStats => this.renderTeam(teamStats))}
            </div>
            :
            <p>You are a member of every team in this community!</p>
        }
      </div >
    );
  }

  renderTeam(teamStats) {
    const teamObj = teamStats.team;
    const teamLogo = teamObj.logo;

    return (
      <div className="team-card"
        onClick={(e) => {
          if (!(e.target.classList.contains("join-team-btn-small"))) {
            window.location = `${this.props.links.teams + "/" + teamObj.id}`;
          }
        }} key={teamObj.id}>
        <div className="row no-gutter flex" style={{ width: '100%', height: '100%' }}>
          <div className="col-sm-3 team-card-column">
            {this.renderTeamTitle(teamObj)}
          </div>
          <div className="col-sm-9">
            <div className="row" style={{ margin: '0 auto' }}>
              {teamLogo ?
                <>
                  <div className="col-8 team-card-column">
                    <TeamInfoBars teamStats={teamStats} />
                  </div>
                  <div className="col-4 team-card-column">
                    <img className='z-depth-1 team-card-img' src={teamLogo.url} alt="" />
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
      </div >
    );
  }

  renderTeamTitle(teamObj) {

    //to be replaced by a team tagline, inherently limited to some amount of characters
    const teamDescription = teamObj.description.length > 70 ?
      teamObj.description.substring(0, 70) + "..."
      : teamObj.description;

    return (
      <div className="row team-card-content" style={{ marginLeft: 0, marginRight: 0 }}>
        <div className="col-9 col-sm-12">
          <h4 className="team-card-title"><b>{teamObj.name}</b></h4>
          <p className="team-card-description">{teamDescription}</p>
        </div>
        <div className="col-3 col-sm-12">
          {!this.inTeam(teamObj.id) &&
            <button
              onClick={() => {
                this.joinTeam(teamObj);
              }}
              className="btn btn-success round-me join-team-btn-small raise"
            >
              Join
            </button>
          }
        </div>
      </div>
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

  joinTeam = (team) => {
    const body = {
      user_id: this.props.user.id,
      team_id: team.id,
    };
    apiCall("teams.join", body)
      .then((json) => {
        if (json.success) {
          this.props.reduxJoinTeam(team);
          this.props.reduxAddTeamMember({
            team: team,
            member: {
              households: this.props.user.households.length,
              actions:
                this.props.todo && this.props.done
                  ? this.props.todo.length + this.props.done.length
                  : 0,
              actions_completed: this.props.done.length,
              actions_todo: this.props.todo.length,
            },
          });
          this.forceUpdate();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

}
const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    todo: store.user.todo,
    done: store.user.done,
    teamsPage: store.page.teamsPage,
    links: store.links,
  };
};
const mapDispatchToProps = {
  reduxJoinTeam,
  reduxAddTeamMember
};
export default connect(mapStoreToProps, mapDispatchToProps)(TeamsPage);
