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
import PageTitle from '../../Shared/PageTitle';

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

    return (
      <>
        <div className="boxed_wrapper">
          <BreadCrumbBar
            links={[
              { link: this.props.links.teams, name: "Teams" },
              { name: `Team ${team ? team.id : "..."}` },
            ]}
          />
          <PageTitle style={{ margin: "0 15px" }}>{team.name}</PageTitle>
          <div className='col-12 col-sm-11 col-md-10 col-lg-9 col-xl-8' style={{ margin: 'auto' }}>
            <center>
              <p>
                {team.description.length > 70 ?
                  team.description.substring(0, 70) + "..."
                  : team.description}
              </p>
              <div>
                {!this.inTeam(team.id) ?
                  <button
                    className="btn btn-success round-me start-team-btn raise"
                    onClick={() => {
                      this.joinTeam(team);
                      this.forceUpdate();
                    }}
                  >
                    Join Team
                  </button>
                  :
                  <button
                    className="btn btn-success round-me leave-team-btn raise"
                    onClick={() => {
                      this.leaveTeam(team);
                      this.forceUpdate();
                    }}
                  >
                    Leave Team
                  </button>
                }
                <button
                  className="btn btn-success round-me comp-teams-btn raise"
                  onClick={() => {
                    //TODO
                  }}
                >
                  Contact Admin
              </button>
              </div>

              <div className="row">
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
            </center>
          </div>
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
