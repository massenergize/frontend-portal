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
import { addCommasToNumber } from "../../Utils"

class TeamsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const teams = this.props.teamsPage;
    if (teams === null) {
      return (
        <div className="boxed_wrapper">
          <LoadingCircle />
        </div>
      );
    } else if (teams.length === 0) {
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
            There are no teams for this community yet :({" "}
          </h2>
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
                    window.open(this.props.links.contactus, "_blank");
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

            </center>
            {this.renderTeams(teams)}
          </div>
        </div>
      </>
    );
  }

  /* TODO:
   - figure out join button redirecting bug
   - revamp "start team" behaviour
   - cleanup the loading circle/no community stuff
   - add positive feedback upon team join
   - want team card info bars to be tall, but using fixed padding causes overflow on mobile.
      - make three responsively and collectively take up card height
   - sidebar? search bar? any sorting other than alphabetical default?
      - keep the image getting super squished depending on screen size
   - make font sizes smaller on thin windows? (CSS media queries?)
   - will we have closed/open teams? will require more complex data flow
  */

  renderTeams(teams) {
    const [myTeams, otherTeams] = teams.reduce(([pass, fail], team) => {
      return this.inTeam(team.team.id) ? [[...pass, team], fail] : [pass, [...fail, team]];
    }, [[], []]);

    return (
      <div>
        <h3 className="teams-subheader">My Teams</h3>
        {myTeams.length > 0 ?
          <div>
            {myTeams.map(team => this.renderTeam(team))}
          </div>
          :
          <p>
            {this.props.user ?
              "You have not joined any teams. View the teams in this community below."
              :
              "You must sign in to view your teams."
            }
          </p>
        }
        <hr></hr>
        <h3 className="teams-subheader">Other Teams</h3>
        {otherTeams.length > 0 ?
          <div>
            {otherTeams.map(team => this.renderTeam(team))}
          </div>
          :
          <p>You are a member of every team in this community!</p>
        }
      </div >
    );
  }

  renderTeam(team) {
    const teamObj = team.team;
    const teamLogo = teamObj.logo;

    return (
      <div className="team-card m-action-item vendor-hover"
        onClick={(e) => {
          const joinTeamBtn = document.getElementsByClassName("join-team-btn")[0];
          if (!(joinTeamBtn == e.target)) {
            window.location = `${this.props.links.teams + "/" + teamObj.id}`;
          }
        }} key={teamObj.id}>
        <div className="row no-gutter flex-nowrap" style={{ width: '100%', height: '100%' }}>
          <div className="col-3 team-card-column">
            {this.renderTeamTitle(teamObj)}
          </div>
          {teamLogo ?
            <>
              <div className="col-6 team-card-column">
                {this.renderTeamStats(team)}
              </div>
              <div className="col-3 team-card-column">
                {this.renderTeamLogo(teamLogo)}
              </div>
            </>
            :
            <div className="col-9 team-card-column">
              {this.renderTeamStats(team)}
            </div>
          }
        </div>
      </div >
    );
  }

  renderTeamTitle(teamObj) {

    //to be replaced by a team tagline, inherently limited to some amount of characters
    const teamDescription = teamObj.description.length > 40 ?
      teamObj.description.substring(0, 40) + "..."
      : teamObj.description;

    return (
      <div className="team-card-content" >
        <h4 className="team-title"><b>{teamObj.name}</b></h4>
        <p className="team-description">{teamDescription}</p>
        {!this.inTeam(teamObj.id) &&
          <button
            onClick={() => {
              this.joinTeam(teamObj);
              this.forceUpdate();
            }}
            className="btn btn-success round-me join-team-btn raise"
          >
            Join Team
        </button>
        }
      </ div>
    );
  }

  renderTeamStats(team) {

    const actions = team.actions_completed;
    const carbonSaved = team.carbon_footprint_reduction;

    let actionsPerHousehold, carbonSavedPerHousehold;
    //used team.members to be consistent with how I'm displaying households below
    const households = team.members;

    if (households !== 0) {
      actionsPerHousehold = (actions / households).toFixed(1);
      carbonSavedPerHousehold = (carbonSaved / households).toFixed(1);
    } else {
      actionsPerHousehold = carbonSavedPerHousehold = "0.0";
    }

    return (
      <div className="team-card-content">
        <div className="info-section household">
          <p><b>{addCommasToNumber(households)}</b> household{(households !== 1) && 's'}</p>
        </div>
        <div className="info-section data">
          <p><b>{addCommasToNumber(actions)}</b> actions completed (<b>{addCommasToNumber(actionsPerHousehold)}</b> per household)</p>
        </div>
        <div className="info-section data">
          <p> <b>{addCommasToNumber(carbonSaved)}</b> lbs. carbon saved (<b>{addCommasToNumber(carbonSavedPerHousehold)}</b> per household)</p>
        </div>
      </ div>
    );
  }

  renderTeamLogo(teamLogo) {
    return <img className='z-depth-1 team-card-img' src={teamLogo.url} alt="" />
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
