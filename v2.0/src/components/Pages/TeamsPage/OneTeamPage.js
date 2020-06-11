import React from 'react';
import { connect } from "react-redux";
import {
  reduxJoinTeam,
  reduxLeaveTeam,
} from "../../../redux/actions/userActions";
import {
  reduxAddTeamMember,
  reduxRemoveTeamMember,
} from "../../../redux/actions/pageActions";
import Error404 from "./../Errors/404";
import LoadingCircle from "../../Shared/LoadingCircle";
import { apiCall } from "../../../api/functions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import TeamInfoBars from "./TeamInfoBars";

class OneTeamPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      team: null,
      loading: true
    }
  }

  fetch(id) {
    apiCall('teams.info', { team_id: id }).then(json => {
      if (json.success) {
        this.setState({
          team: json.data,
          loading: false
        });
      }
    }).catch(err => {
      this.setState({ error: err.message, loading: false });
    })
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetch(id);
  }

  render() {

    const { team, loading } = this.state;

    if (loading || !this.props.teamsPage) {
      return <LoadingCircle />;
    }
    if (!team) {
      return <Error404 />;
    }

    const teamStats = this.props.teamsPage.filter(otherTeam =>
      otherTeam.team.id === team.id
    )[0];
    const teamLogo = team.logo;

    const header = <>
      <h2 className="cool-font">{team.name}</h2>
      <p>
        {team.description.length > 70 ?
          team.description.substring(0, 70) + "..."
          : team.description}
      </p>
    </>;

    return (
      <>
        <div className="boxed_wrapper">
          <BreadCrumbBar
            links={[
              { link: this.props.links.teams, name: "Teams" },
              { name: team.name },
            ]}
          />
          <div className='col-12 col-sm-9 col-md-6 col-lg-5 col-xl-5' style={{ margin: 'auto' }}>
            <div className="row no-gutters">
              {teamLogo ?
                <>
                  <div className="col-4 team-card-column">
                    <img className='z-depth-1 team-img' src={teamLogo.url} alt="" />
                  </div>
                  <div className="col-8 team-card-column">
                    <div style={{ paddingRight: "15px" }}>
                      {header}
                    </div>
                  </div>
                </>
                :
                <div className="col-12">
                  <center>
                    {header}
                  </center>
                </div>
              }
            </div>
            <div className="row">
              <div className="team-card-column">
                <TeamInfoBars teamStats={teamStats} />
              </div>
            </div>
          </div>

          <br />

          <div className='col-12 col-sm-11 col-md-11 col-lg-10 col-xl-10' style={{ margin: 'auto' }}>
            <div className="row">
              <div className="col-sm-5 col-12">
                <div className="row" style={{ margin: 0 }}>
                  <div className="one-team-content-section">
                    <h5><b>Description</b></h5>
                    <p>
                      {team.description}
                    </p>
                  </div>
                </div>
                <div className="row" style={{ margin: 0 }}>
                  <div className="one-team-content-section">
                    <h5><b>Members</b></h5>
                    <p>
                      <ul>
                        {team.members.map(member => <li>{member.preferred_name}</li>)}
                      </ul>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-7 col-12">
                <div className="one-team-content-section">
                  <h5><b>Stats</b></h5>
                  <p>
                    {/* graphs will go here! */}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <br />

          <div>
            <center>
              {!this.inTeam(team.id) ?
                <button
                  className="btn btn-success round-me join-team-btn-big raise"
                  onClick={() => {
                    this.joinTeam(team);
                  }}
                >
                  Join Team
                  </button>
                :
                <button
                  className="btn btn-success round-me leave-team-btn raise"
                  onClick={() => {
                    this.leaveTeam(team);
                  }}
                >
                  Leave Team
                  </button>
              }
              <button
                className="btn btn-success round-me contact-admin-btn-new raise"
                onClick={() => {
                  //TODO
                }}
              >
                Contact Admin
                </button>
            </center>
          </div>

          <br />

        </div>
      </>
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

  leaveTeam = (team) => {
    const body = {
      user_id: this.props.user.id,
      team_id: team.id,
    };
    apiCall(`teams.leave`, body)
      .then((json) => {
        if (json.success) {
          this.props.reduxLeaveTeam(team);
          this.props.reduxRemoveTeamMember({
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

const mapStoreToProps = store => {
  return {
    user: store.user.info,
    todo: store.user.todo,
    done: store.user.done,
    links: store.links,
    teamsPage: store.page.teamsPage,
  };
};
const mapDispatchToProps = {
  reduxJoinTeam,
  reduxLeaveTeam,
  reduxAddTeamMember,
  reduxRemoveTeamMember,
};
export default connect(mapStoreToProps, mapDispatchToProps)(OneTeamPage);
