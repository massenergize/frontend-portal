import React from "react";
import { connect } from "react-redux";
import LoadingCircle from "../../Shared/LoadingCircle";
import ErrorPage from "./../Errors/ErrorPage";
import { apiCall } from "../../../api/functions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import TeamStatsBars, { PACKED } from "./TeamStatsBars";
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
            style={{ fontSize: 14 }}
            onClick={() => {
              this.setState({ joinLeaveModalOpen: true });
            }}
          >
            Join Team
          </MEButton>
        ) : (
          <div className="" style={{ display: "inline-block" }}>
            <p
              style={{
                color: "#8dc63f",
                textAlign: "center",
                margin: 0,
                fontSize: 14,
                textTransform: "capitalize",
              }}
            >
              <i className="fa fa-check-circle"></i> in this team{" "}
              {!isInThisTeam && "via a sub-team"}
            </p>
          </div>
        )}
      </>
    );

    const hasLogo = team && team.logo && team.logo.url;
    const teamTitle = (
      <>
        {team.parent && (
          <span style={{ fontSize: "16px" }}>
            <a className="me-link" href={`${links.teams}/${team.parent.id}`}>
              {team.parent.name}
            </a>
            &nbsp;/ {team.name}
            <br />
          </span>
        )}
      </>
    );

    const subTeams = teamData.subTeams && teamData.subTeams.length > 0;
    const teamInfo = {
      teamTitle,
      teamData,
      subTeams,
      hasLogo,
      team,
      links,
      remountForcer,
    };
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
              <div className="col-md-3 col-12" style={{ marginTop: 0 }}>
                {/* ------------------------- NARROW LEFT SIDE FOR (ABOUT US, TEAM MEMBERS, SUBTEAMS) --------------------- */}
                <div className="phone-vanish" style={{ padding: "0px 10px" }}>
                  {this.renderMoreTeamInfo(teamInfo)}
                </div>
              </div>
              {/* ----------------------------------------- GRAPH AREA, TEAM TITLE, AND OTHER TEAM INFO ------------------------- */}
              <div className="col-md-9 col-12">
                <div className="team-card-column" style={{ margin: "0 auto" }}>
                  <>
                    <div className="team-card-column col-12">
                      <h2
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                        className="cool-font team-card-content"
                      >
                        {hasLogo && ( //img only shows in mobile view
                          <img
                            className="one-team-image-mobile pc-vanish"
                            src={team.logo.url}
                            alt=""
                          />
                        )}
                        {team && team.name}
                        {!isInTeam ? (
                          <i
                            className="fa fa-long-arrow-left"
                            style={{
                              marginLeft: 17,
                              color: isInTeam ? "black" : "#fd704c",
                            }}
                          ></i>
                        ) : (
                          <></>
                        )}
                        <span style={{ margin: "0px 15px" }}>
                          {buttonOrInTeam}
                        </span>
                      </h2>
                    </div>
                  </>
                </div>

                <div className="row">
                  <div className="team-card-column">
                    <p
                      className="team-card-content"
                      style={{
                        textAlign: "center",
                        margin: "8px auto",
                        color: "#282828",
                      }}
                    >
                      {team.tagline}
                    </p>
                  </div>
                </div>
                <TeamStatsBars
                  teamStats={team.is_published && teamData}
                  type={PACKED}
                />
                <div className="row" style={{ margin: 0 }}>
                  <div className="one-team-content-section z-depth-float-half me-anime-open-in mob-zero-padding mob-borderless">
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

                    <p style={{ textAlign: "center", marginTop: 15 }}>
                      Complete{" "}
                      <Link to={links.actions} className="me-link">
                        more actions
                      </Link>
                      !
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

                {/* -------------------------------- SHARING BUTTONS FOR PC MODE -------------------------- */}
                <div
                  className="row justify-content-center phone-vanish"
                  style={{ marginTop: 50 }}
                >
                  {/* ------------------------ LEFT NARROR AREA THAT DISPLAYS TEAM INFO IN PC MODE ---------------------- */}
                  {this.renderSocials(team)}
                </div>
                <br />
              </div>
              {/* ------------------------------- MOBILE TEAM INFO AREA ----------------------- */}
              <div
                className="pc-vanish"
                style={{
                  padding: "0px 20px",
                  margin: "20px 10px",
                  width: "100%",
                }}
              >
                {this.renderMoreTeamInfo(teamInfo)}
              </div>
            </div>
          </div>

          <br />

          {/* -------------- SHARING BUTTONS FOR MOBILE ---------------------------- */}
          <div className="row justify-content-center pc-vanish">
            {this.renderSocials(team)}
          </div>
          <br />
        </div>
      </>
    );
  }

  renderSocials(team) {
    return (
      <>
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

        <br />
      </>
    );
  }

  renderMoreTeamInfo(props) {
    const {
      teamTitle,
      teamData,
      subTeams,
      hasLogo,
      team,
      links,
      remountForcer,
    } = props;
    return (
      <>
        <div className="row phone-vanish" style={{ minHeight: 142 }}>
          <center>
            {hasLogo && (
              <img
                className="one-team-image team-card-content"
                src={team.logo.url}
                alt=""
              />
            )}
            {team.parent && <div style={{ padding: 10 }}>{teamTitle}</div>}
          </center>
        </div>
        <div className="row">
          <MESectionWrapper
            headerText={`About ${team && team.name}`}
            motherStyle={{ width: "100%" }}
            headerType="plain"
            className="team-s-w-header team-s-w-about-us-h"
            containerClassName="team-s-w-body "
            caret
          >
            <div dangerouslySetInnerHTML={{ __html: team.description }} />
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
