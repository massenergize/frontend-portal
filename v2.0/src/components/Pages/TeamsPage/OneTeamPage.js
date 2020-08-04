import React from "react";
import { connect } from "react-redux";
import LoadingCircle from "../../Shared/LoadingCircle";
import ErrorPage from "./../Errors/ErrorPage";
import { apiCall } from "../../../api/functions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import TeamInfoBars from "./TeamInfoBars";
import TeamActionsGraph from "./TeamActionsGraph";
import TeamMembersList from "./TeamMembersList";
import JoinTeamModal from "./JoinTeamModal";
import LeaveTeamModal from "./LeaveTeamModal";
import EditTeamModal from "./EditTeamModal";
import ContactAdminModal from "./ContactAdminModal";
import ShareButtons from "../../Shared/ShareButtons";
import { Helmet } from "react-helmet";

class OneTeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: null,
      loading: true,
      joinLeaveModalOpen: false,
      contactEditModalOpen: false,
    };
  }

  async fetch(id) {
    try {
      const json = await apiCall("teams.info", { team_id: id });
      if (json.success) {
        this.setState({ team: json.data });
      } else {
        this.setState({ error: json.error });
      }
    } catch (err) {
      this.setState({ error: err });
    } finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetch(id);
  }

  render() {
    const { team, loading, error,
      joinLeaveModalOpen, contactEditModalOpen } = this.state;

    if (loading || !this.props.teamsPage) {
      return <LoadingCircle />;
    }
    if (!team || error) {
      return (
        <ErrorPage
          errorMessage="Unable to load this Team"
          errorDescription={
            error ? error : "Unknown cause"
          }
        />
      );
    }

    const teamStats = this.props.teamsPage.filter(
      (otherTeam) => otherTeam.team.id === team.id
    )[0];
    const teamLogo = team.logo;

    const buttonOrInTeam = (
      <>
        {!this.inTeam(team.id) ? (
          <button
            className="btn round-me join-team-btn raise"
            onClick={() => {
              this.setState({ joinLeaveModalOpen: true });
            }}
          >
            Join Team
          </button>
        ) : (
            <div className="team-card-content">
              <p style={{ color: "#8dc63f", textAlign: "center", margin: 0 }}>
                &#10003; in this team
            </p>
            </div>
          )}
      </>
    );

    return (
      <>
        <Helmet>
          <meta property="og:title" content={team.name} />
          <meta property="og:image" content={team.image && team.image.url} />
          <meta property="og:description" content={team.tagline} />
          <meta property="og:url" content={window.location.href} />
        </Helmet>

        {contactEditModalOpen && (
          this.teamAdmin(team.id) ?
            <EditTeamModal team={team} onClose={this.onContactEditModalClose} onTeamEdit={this.onTeamEdit} />
            :
            <ContactAdminModal team={team} onClose={this.onContactEditModalClose} />
        )}

        {joinLeaveModalOpen &&
          (this.inTeam(team.id) ? (
            <LeaveTeamModal
              team={team}
              onLeave={this.onTeamJoinOrLeave}
              onClose={this.onJoinLeaveModalClose}
            />
          ) : (
              <JoinTeamModal
                team={team}
                onJoin={this.onTeamJoinOrLeave}
                onClose={this.onJoinLeaveModalClose}
              />
            ))}

        <div className="boxed_wrapper">
          <BreadCrumbBar
            links={[
              { link: this.props.links.teams, name: "Teams" },
              { name: team.name },
            ]}
          />
          <div
            className="col-12 col-sm-10 col-md-7 col-lg-6 col-xl-6"
            style={{ margin: "auto" }}
          >
            <div className="team-card-column" style={{ margin: "0 auto" }}>
              {teamLogo ? (
                <>
                  <div className="team-card-column col-3">
                    <img
                      className="one-team-image team-card-content"
                      src={teamLogo.url}
                      alt=""
                    />
                  </div>
                  <div className="team-card-column col-6">
                    <h2
                      style={{ textAlign: "center" }}
                      className="cool-font team-card-content"
                    >
                      {team.name}
                    </h2>
                  </div>
                  <div
                    className="team-card-column col-3"
                    style={{ padding: 0 }}
                  >
                    {buttonOrInTeam}
                  </div>
                </>
              ) : (
                  <>
                    <div className="team-card-column col-9">
                      <h2
                        style={{ textAlign: "left" }}
                        className="cool-font team-card-content"
                      >
                        {team.name}
                      </h2>
                    </div>
                    <div
                      className="team-card-column col-3"
                      style={{ padding: 0 }}
                    >
                      {buttonOrInTeam}
                    </div>
                  </>
                )}
            </div>

            <div className="row">
              <div className="team-card-column">
                <p className="team-card-content" style={{ textAlign: 'center', margin: '5px auto' }}>
                  {team.tagline}
                </p>
              </div>
            </div>

            <div className="row">
              <div className="team-card-column">
                <TeamInfoBars teamStats={teamStats} />
              </div>
            </div>
          </div>

          <br />

          <div
            className="col-12 col-sm-11 col-md-11 col-lg-10 col-xl-10"
            style={{ margin: "auto" }}
          >
            <div className="row">
              <div className="col-md-5 col-12">
                <div className="row" style={{ margin: 0 }}>
                  <div className="one-team-content-section slight-lift">
                    <h5>
                      <b>Description</b>
                    </h5>
                    <p>{team.description}</p>
                  </div>
                </div>
                <div className="row" style={{ margin: 0 }}>
                  <div className="one-team-content-section slight-lift">
                    <h5 style={{ margin: 0 }}>
                      <b>Members</b>
                    </h5>
                    <TeamMembersList
                      key={this.state.remountForcer}
                      teamID={team.id}
                    />
                  </div>
                </div>

              </div>
              <div className="col-md-7 col-12">
                <div className="one-team-content-section slight-lift">
                  <h5>
                    <b>Actions Completed</b>
                  </h5>
                  <TeamActionsGraph
                    key={this.state.remountForcer}
                    teamID={team.id}
                  />
                </div>
              </div>
            </div>
          </div>

          <br />

          <div className="row justify-content-center">
            <div style={{ paddingRight: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  className="btn round-me contact-admin-btn-new raise"
                  onClick={() => {
                    this.setState({ contactEditModalOpen: true });
                  }}
                >
                  {this.props.user && this.teamAdmin(team.id) ? "Edit Team" : "Contact Admin"}
                </button>
              </div>
              {this.props.user && this.inTeam(team.id) && !this.teamAdmin(team.id) &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    className="btn round-me leave-team-btn raise"
                    onClick={() => {
                      this.setState({ joinLeaveModalOpen: true });
                    }}
                  >
                    Leave Team
                  </button>
                </div>
              }
            </div>
            <div style={{ display: 'block' }}>
              <ShareButtons label="Share this team!" pageTitle={team.name} pageDescription={team.tagline} url={window.location.href} />
            </div>
          </div>
          <br />
        </div>
      </>
    );
  }

  teamAdmin = (team_id) => {
    //TODO: implement
    //how? could be done using the preferred names, but that is encapsulated by TeamMembersList...
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
    this.setState({ joinLeaveModalOpen: false, remountForcer: Math.random() });
  };

  onJoinLeaveModalClose = () => {
    this.setState({ joinLeaveModalOpen: false });
  };

  onTeamEdit = () => {
    this.setState({ contactEditModalOpen: false, remountForcer: Math.random() });
  }

  onContactEditModalClose = () => {
    this.setState({ contactEditModalOpen: false });
  };
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
    teamsPage: store.page.teamsPage,
  };
};
export default connect(mapStoreToProps, null)(OneTeamPage);
