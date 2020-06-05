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
          <PageTitle>Teams in this Community</PageTitle>

          <center>
            <p className="col-9">
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
              </button>{" "}
              <div style={{
                width: '10px',
                height: 'auto',
                display: 'inline-block'
              }}>
              </div>
              <button
                className="btn btn-success round-me comp-teams-btn raise"
                onClick={() => {
                  window.location = `${this.props.links.teams + "/compare"}`;
                }}
              >
                Compare Teams
              </button>{" "}
            </div>

          </center>

          <div className="boxed_wrapper">
            {this.renderTeams(teams)}
          </div>

        </div>
      </>
    );
  }

  /* TODO:
   - revamp start team behaviour
   - cleanup the loading circle/no community stuff
   - two buttons on top:
      - why fully black on hover? want to just darken like join team button
      - improve positioning on mobile
   - add positive feedback upon team join
   - want team card info bars to be tall, but using fixed padding causes overflow on mobile.
      - make three responsively and collectively take up card height
   - sidebar? search bar? any sorting other than alphabetical default?
   - image sizing options:
      - keep card design and lock image aspect ratio at 4:3
      - drop the info at the bottom of the card on mobile and put the title/image accross the top
      - keep the image getting super squished depending on screen size
   - make font sizes smaller on thin windows? (CSS media queries?)
   - will we have closed/open teams? will require more complex data flow
  */

  renderTeams(teams) {
    const [myTeams, otherTeams] = teams.reduce(([pass, fail], team) => {
      return this.inTeam(team.team.id) ? [[...pass, team], fail] : [pass, [...fail, team]];
    }, [[], []]);

    return (
      <div className='col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7' style={{ margin: 'auto' }}>
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
          <p>
            You are a member of every team in this community!
          </p>
        }
      </div >
    );
  }

  renderTeam(team) {
    const teamObj = team.team;
    const teamLogo = teamObj.logo;

    return (
      <div className=" team-card item style-1 clearfix m-action-item vendor-hover"
        onClick={(e) => {
          const joinTeamBtn = document.getElementsByClassName("join-team-btn")[0];
          if (!joinTeamBtn.contains(e.target)) {
            window.location = `${this.props.links.teams + "/" + teamObj.id}`
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
                {this.renderTeamLogo(teamObj)}
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
    return (
      <div className="team-card-content" >
        <h4><b>{teamObj.name}</b></h4>
        <p>{teamObj.description}</p>
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
    return (
      <div className="team-card-content">
        <div className="info-section household">
          <p><b>{team.households}</b> households - <b>{team.members}</b> members</p>
        </div>
        <div className="info-section data">
          <p><b>{team.actions_completed}</b> actions completed (<b>{team.actions_completed / team.households}</b> per household)</p>
        </div>
        <div className="info-section data">
          <p> <b>{team.carbon_footprint_reduction}</b> lbs. carbon saved (<b>{team.carbon_footprint_reduction / team.households}</b> per household)</p>
        </div>
      </ div>
    );
  }

  renderTeamLogo(teamObj) {
    return <img className='z-depth-1 team-card-img' src={teamObj.logo.url} alt="" />
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
