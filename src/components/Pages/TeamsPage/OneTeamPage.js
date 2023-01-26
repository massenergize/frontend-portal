import React from "react";
import { connect } from "react-redux";
import LoadingCircle from "../../Shared/LoadingCircle";
import ErrorPage from "./../Errors/ErrorPage";
import { apiCall } from "../../../api/functions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import TeamStatsBars, { PACKED } from "./TeamStatsBars";
import TeamActionsGraph from "./TeamActionsGraph";
import TeamActionsList from "./TeamActionsList";
import TeamMembersList from "./TeamMembersList";
import JoinLeaveTeamModal from "./JoinLeaveTeamModal";
import TeamInfoModal from "./TeamInfoModal";
import ContactAdminModal from "./ContactAdminModal";
import ShareButtons from "../../Shared/ShareButtons";
import { getTeamData, inTeam, inThisTeam } from "./utils.js";
import { Helmet } from "react-helmet";
import { Link, withRouter } from "react-router-dom";
import MEButton from "../Widgets/MEButton";
import MESectionWrapper from "../Widgets/MESectionWrapper";
import URLS from "../../../api/urls";
import MELightDropDown from "../Widgets/MELightDropDown";
import METabView from "../Widgets/METabView/METabView";
import MEModal from "../Widgets/MEModal";
import { reduxToggleGuestAuthDialog } from "../../../redux/actions/pageActions";
import { bindActionCreators } from "redux";
import { PREF_EQ_DEFAULT } from "../../Utils"

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
      show: null,
    };
    this.itemSelected = this.itemSelected.bind(this);
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
    window.gtag('set', 'page_title', {page_title: "OneTeamPage"});
    const { id } = this.props.match.params;
    this.fetch(id);
    // TODO: get show option from local storage
    this.setState({ showOption: "Graph" });
  }

  componentDidUpdate() {
    const { id } = this.props.match.params;
    // if (id !== prevProps.match.params.id) {
    if (this.props.teamsStats && !this.state.teamData && !this.state.error) {
      this.fetch(id);
    }
  }

  itemSelected(status) {
    if (status === MELightDropDown.NONE) return;
    // TODO: update localStorage to record choice
    this.setState({ showOption: status });
  }

  makeTabs({ subTeams, remountForcer, team }) {
    return [
      {
        icon: "fa-bar-chart",
        name: "Graph",
        key: "graph",
        component: (
          <TeamsTabWrapper subTeams={subTeams} links={this.props.links}>
            <TeamActionsGraph key={remountForcer} teamID={team.id} />
          </TeamsTabWrapper>
        ),
      },
      {
        icon: "fa-list",
        name: "List",
        key: "list",
        component: (
          <TeamsTabWrapper subTeams={subTeams} links={this.props.links}>
            <TeamActionsList
              key={remountForcer}
              teamID={team.id}
              history={this.props.history}
              links={this.props.links}
              community={this.props.community}
              setConfirmationInfo={(data) => this.setState({ show: data })}
            />
          </TeamsTabWrapper>
        ),
      },
    ];
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
    const { user, links, toggleGuestAuthDialog } = this.props;
    const isInTeam = inTeam(user, teamData);
    const isInThisTeam = inThisTeam(user, teamData.team);

    const buttonOrInTeam = (
      <>
        {!isInTeam ? (
          !user?.is_guest && (
            <MEButton
              style={{ fontSize: 14 }}
              onClick={() => {
                if (!user) return toggleGuestAuthDialog(true);
                this.setState({ joinLeaveModalOpen: true });
              }}
            >
              Join Team
            </MEButton>
          )
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
    const isBigText = team?.description?.length >= 350;
    const teamInfo = {
      teamTitle,
      teamData,
      subTeams,
      hasLogo,
      team,
      links,
      remountForcer,
      isBigText,
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
          <MEModal
            show={this.state.show?.modal}
            close={() => this.setState({ show: null })}
            v2
          >
            <OutsideCommunityVisitConfirmation
              info={this.state.show?.info}
              close={() => this.setState({ show: null })}
            />
          </MEModal>
          <div
            className="col-12 col-sm-11 col-md-11 col-lg-10 col-xl-8 test-one-team-wrapper"
            data-has-big-text={isBigText && "true"}
            data-user-is-logged-in={user ? true : false}
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
                        className="cool-font team-name-container"
                      >
                        {hasLogo && ( //img only shows in mobile view
                          <img
                            className="one-team-image-mobile pc-vanish"
                            src={team.logo.url}
                            alt=""
                          />
                        )}
                        <div className="test-team-name">
                          {team && team.name}
                        </div>
                        <div
                          style={{ margin: "0px 15px" }}
                          id="test-join-team-btn"
                        >
                          {buttonOrInTeam}
                        </div>
                      </h2>
                    </div>
                  </>
                </div>

                <div className="row">
                  <div className="team-card-column">
                    <p
                      className="team-card-content test-team-tagline"
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
                  pref_eq={this.props.pref_eq}
                />
                <div className="row" style={{ margin: 0 }}>
                  {isBigText && (
                    <div
                      style={{ marginTop: 15, marginBottom: 15 }}
                      className="team-about-richtext-wrapper test-team-big-text-wrapper"
                      dangerouslySetInnerHTML={{ __html: team.description }}
                    />
                  )}
                  <METabView
                    tabs={this.makeTabs({ subTeams, remountForcer, team })}
                    defaultTab="graph"
                  />
                  <center style={{ width: "100%" }}>
                    <MEButton
                      style={{ padding: "8px 21px" }}
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
    const { community } = this.props;
    const { subdomain } = community || {};

    return (
      <>
        {team.is_published && (
          <div style={{ display: "block" }}>
            <ShareButtons
              label="Share this team!"
              pageTitle={team.name}
              pageDescription={team.tagline}
              url={`${URLS.SHARE}/${subdomain}/team/${team.id}`}
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
      isBigText,
    } = props;

    return (
      <>
        <div className="row phone-vanish" style={{ minHeight: 142 }}>
          <center style={{ width: "100%", padding: 4 }}>
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
        {!isBigText && (
          <div className="row">
            <MESectionWrapper
              headerText={`About ${team && team.name}`}
              motherStyle={{ width: "100%" }}
              headerType="plain"
              className="team-s-w-header team-s-w-about-us-h"
              containerClassName="team-s-w-body "
              caret
            >
              <div
                className="team-about-richtext-wrapper test-team-small-text"
                dangerouslySetInnerHTML={{ __html: team.description }}
              />
            </MESectionWrapper>
          </div>
        )}
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
                          <a
                            style={{ verticalAlign: "text-top" }}
                            href={`${links.teams}/${subTeamStats.team.id}`}
                            className="subteams-link"
                          >
                            <i
                              className="fa  fa-long-arrow-right"
                              style={{ marginRight: 6 }}
                            ></i>
                            {subTeamStats.team.name}
                          </a>
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
    community: store.page.comInformation,
    links: store.links,
    teamsStats: store.page.teams,
    pref_eq: store.user.pref_equivalence || PREF_EQ_DEFAULT,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { toggleGuestAuthDialog: reduxToggleGuestAuthDialog },
    dispatch
  );
};
export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(withRouter(OneTeamPage));

const TeamsTabWrapper = ({ children, links, subTeams }) => {
  return (
    <div
      className="one-team-content-section z-depth-float-half me-anime-open-in mob-zero-padding mob-borderless"
      style={{ width: "100%" }}
    >
      <h5>
        <b>Actions Completed</b>
        <br />
        {subTeams && (
          <>
            <small>Contains actions of sub-teams</small>
          </>
        )}
      </h5>
      <div style={{ width: "100%" }}>{children}</div>
      <p style={{ textAlign: "center", marginTop: 15 }}>
        Complete{" "}
        <Link to={links.actions} className="me-link">
          more actions
        </Link>
        !
      </p>
    </div>
  );
};

const OutsideCommunityVisitConfirmation = ({ info, close }) => {
  const community = info?.community;
  const url =
    window.location.protocol +
    "//" +
    window.location.host +
    "/" +
    community?.subdomain +
    "/actions/" +
    info?.id;

  return (
    <div style={{ height: "100%", alignItems: "center" }}>
      <div style={{ padding: 20 }}>
        <p style={{ color: "black" }}>
          This action is not in your community, its in{" "}
          <b style={{ color: "var(--app-theme-orange)" }}>
            "{community?.name}"
          </b>
          . Would you like to see it on the{" "}
          <b style={{ color: "var(--app-theme-orange)", marginRight: 3 }}>
            "{community?.name}"
          </b>
          community site?
        </p>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          position: "absolute",
          bottom: 0,
          left: 0,
          background: "#fbfbfb",
          borderRadius: 10,
        }}
      >
        <div style={{ marginLeft: "auto" }}>
          <button
            className="flat-btn  flat-btn_submit btn-success"
            onClick={() => {
              window.open(url, "_blank");
              close();
            }}
          >
            Yes
          </button>
          <button className="flat-btn close-flat" onClick={() => close()}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};
