import React from "react";
import { connect } from "react-redux";
import LoadingCircle from "../../Shared/LoadingCircle";
import ErrorPage from "./../Errors/ErrorPage";
import { apiCall } from "../../../api/functions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import TeamStatsBars from "./TeamStatsBars";
import TeamActionsGraph from "./TeamActionsGraph";
import TeamMembersList from "./TeamMembersList";
import JoinLeaveTeamModal from "./JoinLeaveTeamModal";
import TeamInfoModal from "./TeamInfoModal";
import ContactAdminModal from "./ContactAdminModal";
import ShareButtons from "../../Shared/ShareButtons";
import { getTeamData, inTeam, inThisTeam } from "./utils.js";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import MEButton from "../Widgets/MEButton";
import MESectionWrapper from "../Widgets/MESectionWrapper";

class OneTeamPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: null,
      loading: true,
      isAdmin: false,
      joinLeaveModalOpen: false,
      contactEditModalOpen: false,
      numOfSubTeams: 0,
    };
  }

  async fetch(id) {
    const { teamsStats } = this.props;
    if (!teamsStats) return;

    try {
      const json = await apiCall("teams.info", { team_id: id });
      if (json.success) {
        const team = json.data;
        const teamStats = teamsStats.find(
          (teamStats) => teamStats.team.id === team.id
        );
        const teamData = getTeamData(teamsStats, teamStats);
        this.setState({
          team: team,
          teamData: teamData,
        });
      } else {
        this.setState({ error: json.error });
      }
    } catch (err) {
      this.setState({ error: err.toString() });
    } finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetch(id);
  }

  componentDidUpdate(prevProps) {
    const { id } = this.props.match.params;
    // if (id !== prevProps.match.params.id) {
    if (this.props.teamsStats && !this.state.teamData && !this.state.error) {
      this.fetch(id);
    }
  }

  render() {
    const { team, loading, error } = this.state;

    if (loading || !this.props.teamsStats) {
      return <LoadingCircle />;
    }
    if (!team || error) {
      return (
        <ErrorPage
          errorMessage="Unable to load this Team"
          errorDescription={error ? error : "Unknown cause"}
        />
      );
    }
    const {
      remountForcer,
      joinLeaveModalOpen,
      contactEditModalOpen,
      isAdmin,
      teamData,
    } = this.state;
    const { user, links } = this.props;

    const isInTeam = inTeam(user, teamData);
    const isInThisTeam = inThisTeam(user, teamData.team);

    const buttonOrInTeam = (
      <>
        {!isInTeam ? (
          <MEButton
            onClick={() => {
              this.setState({ joinLeaveModalOpen: true });
            }}
          >
            Join Team
          </MEButton>
        ) : (
          <div className="team-card-content">
            <p style={{ color: "#8dc63f", textAlign: "center", margin: 0 }}>
              &#10003; in this team {!isInThisTeam && "via a sub-team"}
            </p>
          </div>
        )}
      </>
    );

    const teamTitle = (
      <>
        {team.parent && (
          <span style={{ fontSize: "16px" }}>
            <Link to={`${links.teams}/${team.parent.id}`}>
              {team.parent.name}
            </Link>
            &nbsp;/
            <br />
          </span>
        )}
        {team.name}
      </>
    );

    const subTeams = teamData.subTeams && teamData.subTeams.length > 0;

    return (
      <>
        <Helmet>
          <meta property="og:title" content={team.name} />
          <meta property="og:image" content={team.image && team.image.url} />
          <meta property="og:description" content={team.tagline} />
          <meta property="og:url" content={window.location.href} />
        </Helmet>

        {contactEditModalOpen &&
          (isAdmin ? (
            <TeamInfoModal
              team={team}
              onClose={this.onContactEditModalClose}
              onComplete={this.onTeamEdit}
            />
          ) : (
            <ContactAdminModal
              team={team}
              onClose={this.onContactEditModalClose}
            />
          ))}

        {joinLeaveModalOpen && (
          <JoinLeaveTeamModal
            team={team}
            onComplete={this.onTeamJoinOrLeave}
            onClose={this.onJoinLeaveModalClose}
          />
        )}

        <div
          className="boxed_wrapper"
          style={{ marginBottom: 70, minHeight: window.screen.height - 200 }}
        >
          <BreadCrumbBar
            links={[{ link: links.teams, name: "Teams" }, { name: team.name }]}
          />
          {!team.is_published && (
            <center>
              <p className="error-p" style={{ margin: "15px" }}>
                Team awaiting approval from Community Admin. Only team admins
                can access this page, via its direct URL or the teams listed on
                your profile page.
              </p>
            </center>
          )}

          <div
            className="col-12 col-sm-11 col-md-11 col-lg-10 col-xl-8"
            style={{ margin: "auto" }}
          >
            <div className="row">
              {/* ------------------------- NARROW LEFT SIDE FOR( ABOUT US, TEAM MEMBERS, SUBTEAMS) --------------------- */}
              <div className="col-md-3 col-12">
                <div className="row" style={{ marginTop: "10vh" }}>
                  <MESectionWrapper
                    headerText={`About ${team && team.name}`}
                    motherStyle={{ width: "100%" }}
                    headerType="plain"
                    className="team-s-w-header team-s-w-about-us-h"
                    containerClassName="team-s-w-body "
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: team.description }}
                    />
                  </MESectionWrapper>
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                  <MESectionWrapper
                    headerText={
                      <span>
                        Members{" "}
                        <span className="round-badge">
                          {" "}
                          {teamData && teamData.members > 0
                            ? teamData.members
                            : ""}{" "}
                        </span>
                      </span>
                    }
                    motherStyle={{ width: "100%" }}
                    headerType="plain"
                    className="team-s-w-header team-s-w-members-h"
                    containerClassName="team-s-w-body team-s-w-members-b"
                    caret={true}
                  >
                    {subTeams && (
                      <>
                        <small>Contains members of sub-teams</small>
                      </>
                    )}

                    <TeamMembersList
                      onMembersLoad={this.onMembersLoad}
                      key={remountForcer}
                      teamID={team.id}
                    />
                  </MESectionWrapper>
                </div>
                {subTeams && (
                  <div className="row" style={{ marginTop: 10 }}>
                    <MESectionWrapper
                      headerText={
                        <span>
                          Sub-Teams{" "}
                          <span className="round-badge">
                            {subTeams && teamData.subTeams.length}
                          </span>
                        </span>
                      }
                      motherStyle={{ width: "100%" }}
                      headerType="plain"
                      className="team-s-w-header team-s-w-members-h"
                      containerClassName="team-s-w-body team-s-w-members-b"
                      caret={true}
                    >
                      <div
                        style={{ maxHeight: "200px", overflowY: "auto" }}
                        className="show-scrollbar"
                      >
                        <div className="boxed_wrapper">
                          <div className="team-ul">
                            <ul>
                              {teamData.subTeams.map((subTeamStats) => (
                                <li key={subTeamStats.team.id}>
                                  <Link
                                    style={{ verticalAlign: "text-top" }}
                                    to={`${links.teams}/${subTeamStats.team.id}`}
                                    className="subteams-link"
                                  >
                                    <i
                                      className="fa  fa-long-arrow-right"
                                      style={{ marginRight: 6 }}
                                    ></i>
                                    {subTeamStats.team.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </MESectionWrapper>
                  </div>
                )}
              </div>
              {/* ----------------------------------------- GRAPH AREA, TEAM TITLE, AND OTHER TEAM INFO ------------------------- */}
              <div className="col-md-9 col-12">
                <div className="team-card-column" style={{ margin: "0 auto" }}>
                  {team.logo ? (
                    <>
                      <div className="team-card-column col-3">
                        <img
                          className="one-team-image team-card-content"
                          src={team.logo.url}
                          alt=""
                        />
                      </div>
                      <div className="team-card-column col-6">
                        <h2
                          style={{
                            textAlign: "center",
                            //textTransform: "capitalize",
                          }}
                          className="cool-font team-card-content"
                        >
                          {teamTitle}
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
                          style={{
                            textAlign: "left",
                            //textTransform: "capitalize",
                          }}
                          className="cool-font team-card-content"
                        >
                          {teamTitle}
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
                    <p
                      className="team-card-content"
                      style={{ textAlign: "center", margin: "5px auto" }}
                    >
                      {team.tagline}
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="team-card-column">
                    <TeamStatsBars teamStats={team.is_published && teamData} />
                  </div>
                </div>
                <div className="row" style={{ margin: 0 }}>
                  <div className="one-team-content-section z-depth-float-half me-anime-open-in">
                    <h5>
                      <b>Actions Completed</b>
                      <br />
                      {subTeams && (
                        <>
                          <small>Contains actions of sub-teams</small>
                        </>
                      )}
                    </h5>
                    <TeamActionsGraph key={remountForcer} teamID={team.id} />

                    <p style={{ textAlign: "center" }}>
                      Complete <Link to={links.actions}>more actions</Link>!
                    </p>
                  </div>
                  <center style={{ width: "100%" }}>
                    <MEButton
                      style={{ padding: "8px 21px" }}
                      // className="btn round-me contact-admin-btn-new raise"
                      onClick={() => {
                        this.setState({ contactEditModalOpen: true });
                      }}
                    >
                      {user && isAdmin ? "Edit Team" : "Contact Admin"}
                    </MEButton>

                    {isInThisTeam && !isAdmin && (
                      <MEButton
                        style={{ padding: "8px 21px" }}
                        mediaType="icon"
                        icon="fa fa-times"
                        variation="accent"
                        // className="btn round-me leave-team-btn raise"
                        onClick={() => {
                          this.setState({ joinLeaveModalOpen: true });
                        }}
                      >
                        Leave Team
                      </MEButton>
                    )}
                  </center>
                </div>
              </div>
            </div>
          </div>

          <br />

          <div className="row justify-content-center">
            {team.is_published && (
              <div style={{ display: "block" }}>
                <ShareButtons
                  label="Share this team!"
                  pageTitle={team.name}
                  pageDescription={team.tagline}
                  url={window.location.href}
                />
              </div>
            )}
          </div>
          <br />
        </div>
      </>
    );
  }

  onMembersLoad = (members) => {
    const { user } = this.props;
    const myTeamMember = members.filter((member) => member.user_id === user.id);
    if (myTeamMember.length === 0) return;
    if (myTeamMember[0].is_admin) {
      this.setState({ isAdmin: true });
    }
  };

  onTeamJoinOrLeave = () => {
    this.setState({ joinLeaveModalOpen: false, remountForcer: Math.random() });
  };

  onJoinLeaveModalClose = () => {
    this.setState({ joinLeaveModalOpen: false });
  };

  onTeamEdit = (teamID) => {
    this.setState({ contactEditModalOpen: false, loading: true });
    this.fetch(teamID);
    this.setState({ remountForcer: Math.random() });
  };

  onContactEditModalClose = () => {
    this.setState({ contactEditModalOpen: false });
  };
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
    teamsStats: store.page.teams,
  };
};
export default connect(mapStoreToProps, null)(OneTeamPage);
