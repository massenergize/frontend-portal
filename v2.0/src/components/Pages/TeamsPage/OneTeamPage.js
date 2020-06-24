import React from 'react';
import { connect } from "react-redux";
import Error404 from "./../Errors/404";
import LoadingCircle from "../../Shared/LoadingCircle";
import { apiCall } from "../../../api/functions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import TeamInfoBars from "./TeamInfoBars";
import TeamActionsGraph from "./TeamActionsGraph";
import TeamMembersList from "./TeamMembersList";
import JoinTeamModal from "./JoinTeamModal";
import LeaveTeamModal from "./LeaveTeamModal"
import ContactAdminModal from "./ContactAdminModal";
class OneTeamPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      team: null,
      loading: true,
      teamModalOpen: false,
      contactModalOpen: false
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
    }).finally(() => this.setState({ loading: false }));
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

        {this.state.contactModalOpen && (
          <ContactAdminModal team={team} onClose={this.onContactModalClose} />
        )}

        {this.state.teamModalOpen && (
          this.inTeam(team.id) ?
            <LeaveTeamModal team={team} onLeave={this.onTeamJoinOrLeave} onClose={this.onTeamModalClose} />
            :
            <JoinTeamModal team={team} onJoin={this.onTeamJoinOrLeave} onClose={this.onTeamModalClose} />
        )}

        <div className="boxed_wrapper">
          <BreadCrumbBar
            links={[
              { link: this.props.links.teams, name: "Teams" },
              { name: team.name },
            ]}
          />
          <div className='col-12 col-sm-10 col-md-7 col-lg-6 col-xl-6' style={{ margin: 'auto' }}>

            <div className="team-card-column" style={{ margin: '0 auto' }}>
              <div className="col-9" style={{ display: 'flex' }}>
                {teamLogo ?
                  <>
                    <div className="team-card-column col-4">
                      <img className='one-team-image team-card-content' src={teamLogo.url} alt="" />
                    </div>
                    <div className="team-card-column col-8">
                      <h2 style={{ textAlign: 'center' }} className="cool-font team-card-content">{team.name}</h2>
                    </div>
                  </>
                  :
                  <div className="team-card-column">
                    <h2 className="cool-font team-card-content">{team.name}</h2>
                  </div>
                }
              </div>
              <div className="team-card-column col-3">
                {!this.inTeam(team.id) ?
                  <button
                    
                    className="btn btn-success round-me join-team-btn raise"
                    onClick={() => {
                      this.setState({ teamModalOpen: true });
                    }}
                  >
                    Join Team
                </button>
                  :
                  <div className="team-card-content">
                    <p
                      style={{ color: '#8dc63f', textAlign: 'center', margin: 0 }}>
                      &#10003; in this team
                  </p>
                  </div>
                }
              </div>

            </div>

            <div className="row">
              <div className="team-card-column">
                <p className="team-card-content" style={{ textAlign: 'center', margin: '5px auto' }}>
                  {team.description.length > 70 ?
                    team.description.substring(0, 70) + "..."
                    : team.description}
                </p>
              </div>
            </div>

            <div className='row'>
              <div className="team-card-column">
                <TeamInfoBars teamStats={teamStats} />
              </div>
            </div>


          </div>

          <br />

          <div className='col-12 col-sm-11 col-md-11 col-lg-10 col-xl-10' style={{ margin: 'auto' }}>
            <div className="row">
              <div className="col-md-5 col-12">
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
                    <h5 style={{ margin: 0 }}><b>Members</b></h5>
                    <p style={{ fontSize: "11px", textAlign: 'center' }}>You may have to scroll to see all members</p>
                    <TeamMembersList key={this.state.remountForcer} teamID={team.id} />
                  </div>
                </div>
              </div>
              <div className="col-md-7 col-12">
                <div className="one-team-content-section">
                  <h5><b>Actions Completed</b></h5>
                  <TeamActionsGraph key={this.state.remountForcer} teamID={team.id} />
                </div>
              </div>
            </div>
          </div>

          <br />

          <div>
            <center>
              <button
                className="btn btn-success round-me contact-admin-btn-new raise"
                onClick={() => {
                  this.setState({ contactModalOpen: true });
                }}
              >
                Contact Admin
              </button>
            </center>
            {this.props.user && this.inTeam(team.id) &&
              <center>
                <button
                  className="btn btn-success round-me leave-team-btn raise"
                  onClick={() => {
                    this.setState({ teamModalOpen: true });
                  }}
                >
                  Leave Team
                  </button>
              </center>
            }
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

  onTeamJoinOrLeave = () => {
    this.setState({ teamModalOpen: false, remountForcer: Math.random() });
  }

  onTeamModalClose = () => {
    this.setState({ teamModalOpen: false });
  }

  onContactModalClose = () => {
    this.setState({ contactModalOpen: false });
  }


}

const mapStoreToProps = store => {
  return {
    user: store.user.info,
    links: store.links,
    teamsPage: store.page.teamsPage,
  };
};
export default connect(mapStoreToProps, null)(OneTeamPage);
