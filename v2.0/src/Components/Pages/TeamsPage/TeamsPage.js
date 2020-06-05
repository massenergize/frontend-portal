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
          {/* <h2 className='text-center' style={{ color: '#9e9e9e', margin: "190px 150px", padding: "30px", border: 'solid 2px #fdf9f9', borderRadius: 10 }}> Sorry, there are not teams for this community yet :( </h2> */}
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
          {/* <LoadingCircle /> */}
        </div>
      );
    }
    return (
      <>
        <div className="boxed_wrapper">
          <BreadCrumbBar links={[{ name: "Teams" }]} />

          <PageTitle>Teams in this Community</PageTitle>
          <center>
            <p style={{ color: "black", margin: '0px 20px 20px' }}>
              Teams are groups in a community that wants to collaborate. It
              could be a school, congregation, a group of neighbors or friends, a sports team. Get
              creative!
              </p>
            <div>
              <button
                onClick={() => {
                  window.open(this.props.links.contactus, "_blank");
                }}
                className="btn btn-success round-me start-team-btn raise"
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
                onClick={() => {
                  window.location = `${this.props.links.teams + "/compare"}`;
                }}
                className="btn btn-success round-me comp-teams-btn raise"
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
   - sizing:
      - lock image aspect ratio at 4:3?
      - make stats font size smaller on thin windows?
      - center stats within their own div
   - go over all CSS and use external files and classes instead!!!
   - deal with all API stuff and data flow
  */

  renderTeams(teams) {
    const [myTeams, otherTeams] = teams.reduce(([pass, fail], team) => {
      return this.inTeam(team.team.id) ? [[...pass, team], fail] : [pass, [...fail, team]];
    }, [[], []]);

    console.log(myTeams, otherTeams);

    const subheaderStyle = { color: "#888", fontStyle: 'italic' };

    return (
      <div className='col-11 col-sm-10 col-md-9 col-lg-8 col-xl-7' style={{
        margin: 'auto'
      }}>
        <h3 style={subheaderStyle}>My Teams</h3>
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
        <h3 style={subheaderStyle}>Other Teams</h3>
        <div>
          {otherTeams.map(team => this.renderTeam(team))}
        </div>
      </div >
    );
  }

  renderTeam(team) {
    const teamObj = team.team;
    const teamLogo = teamObj.logo;

    const cardStyle = {
      marginTop: '20px',
      marginBottom: '20px',
      height: '160px',
      border: '1px solid black',
      padding: '10px',
      display: 'flex',
      alignItems: 'center'
    }

    return (
      <div className="item style-1 clearfix m-action-item vendor-hover"
        style={cardStyle}
        onClick={(e) => {
          const joinTeamBtn = document.getElementsByClassName("join-team-btn")[0];
          if (!joinTeamBtn.contains(e.target)) {
            window.location = `${this.props.links.teams + "/" + teamObj.id}`
          }
        }} key={teamObj.id}>
        <div className="row no-gutter flex-nowrap" style={{ width: '100%', height: '100%' }}>
          <div className="col-3">
            {this.renderTeamTitle(teamObj)}
          </div>
          {teamLogo ?
            <>
              <div className="col-6">
                {this.renderTeamStats(team)}
              </div>
              <div className="col-3">
                {this.renderTeamLogo(teamObj)}
              </div>
            </>
            :
            <div className="col-9">
              {this.renderTeamStats(team)}
            </div>
          }
        </div>
      </div >
    );
  }

  renderTeamTitle(teamObj) {
    return (
      <div style={{ width: '90%', display: 'block', margin: 'auto' }} >
        <h4><b>{teamObj.name}</b></h4>
        <p>{teamObj.description}</p>
        {!this.inTeam(teamObj.id) &&
          <button
            onClick={() => {
              //TODO
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

    const pStyle = {
      color: 'black',
      lineHeight: '15px',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontSize: 14,
      padding: '3px',
      margin: "3px 0"
    }

    return (
      <div style={{
        width: '90%', display: 'block', margin: 'auto',
      }}>
        <div style={{
          borderRadius: 20,
          background: '#f67b6130'
        }}>
          <p style={pStyle}><b>{team.households}</b> households - <b>{team.members}</b> members</p>
        </div>
        <div style={{
          borderRadius: 20,
          background: '#8dc63f30'
        }}>
          <p style={pStyle}><b>{team.actions_completed}</b> actions completed (<b>{team.actions_completed / team.households}</b> per household)</p>
        </div>
        <div style={{
          borderRadius: 20,
          background: '#8dc63f30'
        }}>
          <p style={pStyle}> <b>{team.carbon_footprint_reduction}</b> lbs. carbon saved (<b>{team.carbon_footprint_reduction / team.households}</b> per household)</p>
        </div>
      </ div>
    );
  }

  renderTeamLogo(teamObj) {
    return <img className='z-depth-1' style={{
      height: '100%',
      width: '90%',
      objectFit: "cover",
      display: 'block',
      margin: 'auto',
      borderRadius: 10
    }} src={teamObj.logo.url} alt="" />;
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

  goalsList = (team_id) => {
    const body = {
      team_id: team_id,
    };
    return apiCall(`goals.list`, body);
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
