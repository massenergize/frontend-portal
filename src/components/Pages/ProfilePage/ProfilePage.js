import React from "react";
import { connect } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";
import { apiCall } from "../../../api/functions";
import LoadingCircle from "../../Shared/LoadingCircle";
import Cart from "../../Shared/Cart";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import Counter from "./Counter";
import AddingHouseholdForm from "./AddingHouseholdForm";
import EditingProfileForm from "./EditingProfileForm";
// import EventCart from "./EventCart";
import { withFirebase } from "react-redux-firebase";
import VerifyEmailBox from "./../Auth/shared/components/VerifyEmailBox";
import {
  reduxMoveToDone,
  reduxAddHousehold,
  reduxEditHousehold,
  reduxRemoveHousehold,
  reduxLeaveCommunity,
  reduxLoadUserCommunities,
  reduxLeaveTeam,
  reduxLogout,
  reduxSetPreferredEquivalence,
} from "../../../redux/actions/userActions";
import {
  reduxChangeData,
  reduxRemoveTeamMember,
  reduxTeamRemoveHouse,
  reduxTeamRemoveAction,
  reduxTeamAddHouse,
} from "../../../redux/actions/pageActions";
import JoiningCommunityForm from "./JoiningCommunityForm";
import PrintCart from "../../Shared/PrintCart";
import DeleteAccountForm from "./DeleteAccountForm";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeEmailForm from "./ChangeEmailForm";
import Dropdown from "react-bootstrap/Dropdown";
import MEButton from "../Widgets/MEButton";
import MESectionWrapper from "../Widgets/MESectionWrapper";
import MECard from "../Widgets/MECard";
import METextView from "../Widgets/METextView";
import {
  calcEQ,
  getPropsArrayFromJsonArray,
  PREFERRED_EQ,
  PREF_EQ_DEFAULT,
  sumOfCarbonScores,
} from "../../Utils";
import MEDropdown from "../Widgets/MEDropdown";
import { usesOnlyPasswordAuth } from "../Auth/shared/firebase-helpers";
import { AUTH_STATES } from "../Auth/shared/utils";
import BecomeAValidUser from "./BecomeAValidUser";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      addedHouse: false,
      addedDefaultHouse: false,
      selectedHousehold: null,
      editingHH: null,
      joiningCom: false,
      addingHH: false,
      editingProfileForm: null,
      printing: false,
      message: "",
      wantsToBecomeValidUser: false,
    };
    this.handleEQSelection = this.handleEQSelection.bind(this);
  }

  getEqData() {
    const { eq } = this.props;
    const labels = getPropsArrayFromJsonArray(eq || [], "name");
    const values = getPropsArrayFromJsonArray(eq || [], "id");
    return [labels, values];
  }
  handleEQSelection(id) {
    const { eq, reduxSetPreferredEquivalence } = this.props;
    var found;
    if (id) found = eq?.find((item) => item.id === id);
    // Send EQ to redux,
    reduxSetPreferredEquivalence(found);
    // Save EQ to local storage
    const parsed = JSON.stringify(found || {});
    localStorage.setItem(PREFERRED_EQ, parsed);
  }

  showJoiningForm() {
    if (!this.state.joiningCom) {
      return <small></small>;
    }
    return (
      <JoiningCommunityForm
        closeForm={() => this.setState({ joiningCom: false })}
      />
    );
  }
  showCommunitiesSection() {
    const { user } = this.props;
    return (
      <div>
        <MESectionWrapper headerText="Your Communities">
          {this.renderCommunities(user.communities)}
        </MESectionWrapper>
        {this.showJoiningForm()}
        {!this.state.joiningCom && (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            <MEButton onClick={() => this.setState({ joiningCom: true })}>
              Join another Community
            </MEButton>
          </div>
        )}
      </div>
    );
  }

  renderCarbonCounterBox() {
    const { pref_eq } = this.props;
    var score = sumOfCarbonScores(this.props.done || []);
    if (pref_eq) score = calcEQ(score, pref_eq?.value || 0);
    return (
      <Counter
        decimals={1}
        end={parseFloat(score)}
        unit={!pref_eq ? "lbs CO2" : ""}
        icon={`fa ${pref_eq?.icon || "fa-leaf"}`}
        title={
          pref_eq ? pref_eq?.title || `Number of ${pref_eq?.name}` : "Impact"
        }
        info={
          pref_eq?.explanation ||
          "Amount your yearly carbon footprint is reduced through the actions you've taken."
        }
      />
    );
  }
  render() {
    const { fireAuth } = this.props;
    const { wantsToBecomeValidUser } = this.state;
    const userIsNotAuthenticated =
      this.props.authState === AUTH_STATES.USER_IS_NOT_AUTHENTICATED;
    const appIsCheckingFirebase =
      this.props.authState === AUTH_STATES.CHECKING_FIREBASE;
    const appIsCheckingMassEnergize =
      this.props.authState === AUTH_STATES.CHECK_MASS_ENERGIZE;

    if (userIsNotAuthenticated)
      return <Redirect to={this.props.links.signin}> </Redirect>;

    if (appIsCheckingFirebase || appIsCheckingMassEnergize)
      return <LoadingCircle />;

    if (fireAuth && !fireAuth.emailVerified) return <VerifyEmailBox />;

    const myHouseholds = this.props.user?.households || [];

    if (!this.props.teams) {
      return <LoadingCircle />;
    }

    if (myHouseholds.length === 0 && !this.state.addedHouse) {
      this.setState({ addedHouse: true });
      this.addDefaultHousehold(this.props.user, this.props.community);
    }
    if (wantsToBecomeValidUser) return <BecomeAValidUser />;

    const { user, community } = this.props;
    const userIsAGuest = user && user.is_guest;
    console.log("I am the community", community);
    const [eqLabels, eqValues] = this.getEqData();
    return (
      <>
        <div
          className="boxed_wrapper"
          onClick={this.clearError}
          style={{ minHeight: 1950 }}
          id="profile-page-component"
        >
          <BreadCrumbBar links={[{ name: "Profile" }]} />
          <div className="container">
            {this.state.printing ? (
              <>
                <PrintCart />
                <center>
                  <MEButton
                    variation="accent"
                    style={{ marginTop: 10, marginBottom: 30, width: 170 }}
                    onClick={() => this.setState({ printing: false })}
                  >
                    {" "}
                    Cancel
                  </MEButton>
                </center>
              </>
            ) : (
              <div
                className="row"
                style={{ paddingRight: "0px", marginRight: "0px" }}
              >
                <div className="col-lg-9 col-md-9  col-12">
                  {this.renderForm(this.state.editingProfileForm)}
                  {/* ------ PC VERSION --------- */}
                  <section className="fact-counter style-2 sec-padd phone-vanish">
                    <div className="container" style={{ padding: 0 }}>
                      <div
                        className="counter-outer"
                        style={{ background: "white", width: "100%" }}
                      >
                        <div className="row no-gutter">
                          <div className="column counter-column col-lg-4 col-6 ">
                            <Counter
                              end={this.props.done ? this.props.done.length : 0}
                              icon={"fa fa-check-circle"}
                              title={"Actions Completed"}
                            />
                          </div>
                          <div className="column counter-column  d-lg-block d-none col-4 ">
                            <Counter
                              end={this.props.todo ? this.props.todo.length : 0}
                              icon={"fa fa-smile-o"}
                              title={"Actions To Do"}
                            />
                          </div>
                          <div className="column counter-column col-lg-4 col-6">
                            {this.renderCarbonCounterBox()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ------ MOBILE VERSIOn ------- */}
                  <section className="fact-counter style-2 sec-padd">
                    <div className="container" style={{ padding: 0 }}>
                      <div
                        className="counter-outer"
                        style={{ background: "white", width: "100%" }}
                      >
                        <div
                          className="row no-gutter pc-vanish"
                          style={{
                            overflowX: "scroll",
                            height: 210,
                            marginLeft: -70,
                          }}
                        >
                          {/* <div className="column counter-column col-lg-4 col-6 "> */}
                          <div className="column col-lg-4 col-md-4 col-md-4 col-sm-4 col-xs-6 ">
                            <Counter
                              end={this.props.done ? this.props.done.length : 0}
                              icon={"fa fa-check-circle"}
                              title={"Actions Completed"}
                            />
                          </div>
                          {/* <div className="column counter-column  d-lg-block d-none col-4 "> */}
                          <div className="column col-lg-4 col-md-4 col-md-4 col-sm-4 col-xs-6  card1">
                            <Counter
                              end={this.props.todo ? this.props.todo.length : 0}
                              icon={"fa fa-smile-o"}
                              title={"Actions To Do"}
                            />
                          </div>
                          {/* <div className="column counter-column col-lg-4 col-6"  > */}
                          <div
                            id="carbon-counter-box"
                            data-pref-eq-name={this.props.pref_eq?.name}
                            className=" column col-lg-4 col-md-4 col-md-4 col-sm-4 col-xs-6 card2"
                          >
                            {this.renderCarbonCounterBox()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {userIsAGuest && (
                    <div
                      className="become-valid-from-guest touchable-opacity"
                      onClick={() =>
                        this.setState({ wantsToBecomeValidUser: true })
                      }
                    >
                      <p>
                        You are currently a guest of {community?.name || ""},
                        click here to become a registered member
                        <span role="img" aria-label="image">
                          🎊
                        </span>{" "}
                      </p>{" "}
                      <i className=" fa fa-angle-right"></i>
                    </div>
                  )}
                  <div
                    id="eq-list-dropdown-wrapper"
                    data-number-of-eq-items={this.props.eq?.length}
                  >
                    <p style={{ color: "black" }}>
                      What would you like your impact to be measured in?
                    </p>
                    <MEDropdown
                      id="eq-list-dropdown"
                      togglerClassName="eq-list-dropdown"
                      data={[MEDropdown.NONE, ...eqLabels]}
                      dataValues={[null, ...eqValues]}
                      onItemSelected={this.handleEQSelection}
                      value={this.props.pref_eq?.name}
                      childClassName="eq-list-dropdown-item"
                    />
                  </div>
                  <br />
                  <br />
                  <MESectionWrapper headerText="Your Teams ( * Outside This Community )">
                    {this.renderTeams(user.teams)}
                  </MESectionWrapper>
                  <div
                    style={{
                      width: "100%",
                      textAlign: "center",
                      marginTop: 10,
                    }}
                  >
                    <MEButton
                      href={this.props.links.teams}
                      style={{ margin: "5px" }}
                    >
                      View all Teams
                    </MEButton>
                  </div>

                  <br />
                  <MESectionWrapper headerText="Your Households">
                    {this.renderHouseholds(user.households)}
                  </MESectionWrapper>
                  <div
                    style={{
                      width: "100%",
                      textAlign: "center",
                      marginTop: 10,
                      marginBottom: 8,
                    }}
                  >
                    {!this.state.editingHH && !this.state.addingHH && (
                      <MEButton
                        onClick={() =>
                          this.setState({
                            addingHH: true,
                            editingHH: null,
                          })
                        }
                      >
                        If you have another household, let us know
                      </MEButton>
                    )}
                  </div>
                  {!this.state.editingHH && this.state.addingHH && (
                    <MECard className="me-anime-open-in">
                      <AddingHouseholdForm
                        user={this.props.user}
                        addHousehold={this.addHousehold}
                        closeForm={() => this.setState({ addingHH: false })}
                        editHousehold={this.editHousehold}
                      />
                      <MEButton
                        variation="accent"
                        className="cancel-btn-position-fix"
                        onClick={() =>
                          this.setState({ addingHH: false, editingHH: null })
                        }
                      >
                        Cancel
                      </MEButton>
                    </MECard>
                  )}

                  {this.state.deletingHHError ? (
                    <p className="text-danger"> {this.state.deletingHHError}</p>
                  ) : null}
                  <br />

                  {/* --------------- Dont display communities part when a user is editing -------- */}
                  {!this.state.editingHH && this.showCommunitiesSection()}

                  {this.state.leaveComError ? (
                    <p className="text-danger"> {this.state.leaveComError}</p>
                  ) : null}
                  <br />
                  <br />
                  <br />
                </div>
                {/* makes the todo and completed actions carts */}
                <div
                  className="col-lg-3 col-md-3 col-12"
                  style={{
                    paddingRight: "0px",
                    marginRight: "0px",
                    marginTop: 90,
                    height: "fit-content",
                  }}
                >
                  <Cart
                    title="To Do List"
                    actionRels={this.props.todo ? this.props.todo : []}
                    status="TODO"
                  />

                  <Cart
                    title="Completed Actions"
                    actionRels={this.props.done ? this.props.done : []}
                    status="DONE"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  renderForm = (form) => {
    const { settings, user } = this.props;
    const { firebaseAuthSettings } = this.props;
    const { usesOnlyPasswordless } = firebaseAuthSettings?.signInConfig || {};
    const userIsAGuest = user && user.is_guest;

    return (
      <>
        <h4>
          {this.props.user ? (
            <div style={{ display: "inline-block" }}>
              <span style={{ color: "#8dc63f" }}>Welcome</span>{" "}
              {this.props.user.preferred_name}
            </div>
          ) : (
            "Your Profile"
          )}
          <Dropdown onSelect={() => null} style={{ display: "inline-block" }}>
            <Dropdown.Toggle
              style={{ padding: "9px 16px" }}
              className="me-undefault-btn me-universal-btn me-btn-green undo-dropdown-active"
            ></Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                borderTop: "5px solid #8dc63f",
                borderRadius: "0",
                padding: "0",
              }}
              className="me-dropdown-theme me-anime-show-up-from-top z-depth-1"
            >
              {userIsAGuest && (
                <Dropdown.Item
                  onClick={() => {
                    this.setState({ wantsToBecomeValidUser: true });
                  }}
                  className="dropdown-item dropdown-item me-dropdown-theme-item force-padding-20"
                >
                  Become A Registered Member{" "}
                  <span role="img" aria-label="image">
                    🎊
                  </span>
                </Dropdown.Item>
              )}
              {usesOnlyPasswordless && (
                <Dropdown.Item
                  onClick={() =>
                    this.props.history.push(
                      this.props.links?.profile + "/password-less/manage"
                    )
                  }
                  className="dropdown-item dropdown-item me-dropdown-theme-item force-padding-20"
                >
                  Add Password
                </Dropdown.Item>
              )}
              <Dropdown.Item
                onClick={() => this.setState({ editingProfileForm: "edit" })}
                className="dropdown-item dropdown-item me-dropdown-theme-item force-padding-20"
              >
                Edit Profile
              </Dropdown.Item>
              {/* {this.props.auth.providerData &&
              this.props.auth.providerData.length === 1 &&
              this.props.auth.providerData[0].providerId === "password" ? ( */}
              {usesOnlyPasswordAuth(this.props.fireAuth) &&
              !usesOnlyPasswordless ? (
                <>
                  <Dropdown.Item
                    onClick={() =>
                      this.setState({ editingProfileForm: "password" })
                    }
                    className="dropdown-item dropdown-item me-dropdown-theme-item force-padding-20"
                  >
                    Change Password
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      this.setState({ editingProfileForm: "email" })
                    }
                    className="dropdown-item dropdown-item me-dropdown-theme-item force-padding-20"
                  >
                    Change Email
                  </Dropdown.Item>
                </>
              ) : null}
              <Dropdown.Item
                onClick={() => {
                  if (usesOnlyPasswordless)
                    return this.props.history.push(
                      this.props.links.profile + "/password-less/manage"
                    );
                  this.setState({ editingProfileForm: "delete" });
                }}
                className="dropdown-item dropdown-item me-dropdown-theme-item force-padding-20"
              >
                Delete Profile
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          &nbsp;&nbsp;
        </h4>
        <p> {this.state.message ? this.state.message : ""} </p>
        {form === "edit" && (
          <EditingProfileForm
            email={this.props.user.email}
            full_name={this.props.user.full_name}
            preferred_name={this.props.user.preferred_name}
            image={this.props.user.profile_picture}
            closeForm={(message = "") =>
              this.setState({
                editingProfileForm: null,
                message: message ? message : null,
              })
            }
          />
        )}
        {form === "delete" && (
          <DeleteAccountForm
            closeForm={(message = "") =>
              this.setState({
                editingProfileForm: null,
                message: message ? message : null,
              })
            }
          />
        )}
        {form === "password" && (
          <ChangePasswordForm
            closeForm={(message = "") =>
              this.setState({
                editingProfileForm: null,
                message: message ? message : null,
              })
            }
          />
        )}
        {form === "email" && (
          <ChangeEmailForm
            closeForm={(message = "") =>
              this.setState({
                editingProfileForm: null,
                message: message ? message : null,
              })
            }
            email={this.props.user.email}
          />
        )}
      </>
    );
  };
  renderCommunities(communities) {
    if (!communities)
      return (
        <div style={{ textAlign: "center" }}>
          <METextView>You haven't joined any communities yet</METextView>
        </div>
      );
    return Object.keys(communities).map((key) => {
      const community = communities[key];
      return (
        <div key={key} style={{ position: "relative" }}>
          <MECard style={{ borderRadius: 10 }}>
            <METextView
              type="small"
              style={{ display: "inline-block", color: "black" }}
              icon="fa fa-globe"
              mediaType="icon"
            >
              {" "}
              {community.name} &nbsp;
            </METextView>
            <div
              className="put-me-inline pull-right"
              style={{ position: "absolute", right: 20, bottom: "1vh" }}
            >
              <MEButton
                to={`/${community.subdomain}`}
                target="_blank"
                icon="fa fa-eye"
                iconStyle={{ margin: 0 }}
                iconSize="large"
                style={{ padding: "4px 8px" }}
              />
              <MEButton
                onClick={() => this.leaveCommunity(community)}
                className="me-delete-btn"
                icon="fa fa-trash"
                iconStyle={{ margin: 0 }}
                iconSize="large"
                style={{ padding: "4px 10px" }}
              />
            </div>
          </MECard>
        </div>
      );
    });
  }
  renderTeams(teams) {
    if (!teams) return null;
    const currentCommunityTeamIDs = this.props.teams.map(
      (team) => team.team.id
    );

    const inThisCommunity = (team) =>
      currentCommunityTeamIDs && currentCommunityTeamIDs.includes(team.id);

    return Object.keys(teams).map((key) => {
      const team = teams[key];
      return (
        <div key={key}>
          <MECard
            to={`${
              inThisCommunity(team)
                ? this.props.links.teams + "/" + team.id
                : "#"
            } `}
            style={{
              borderRadius: 10,
            }}
          >
            {inThisCommunity(team) ? (
              // <h6>{team.name}</h6>
              <METextView
                style={{ color: "black" }}
                icon="fa fa-users"
                mediaType="icon"
              >
                {team.name}
              </METextView>
            ) : (
              <METextView
                style={{ color: "black" }}
                icon="fa fa-users"
                mediaType="icon"
              >
                {team.name + " *"}
              </METextView>
            )}
            {team.tagline && (
              <METextView
                type="small"
                containerStyle={{ display: "block" }}
                style={{ color: "black" }}
              >
                {team.tagline}
              </METextView>
            )}
          </MECard>
        </div>
      );
    });
  }
  renderHouseholds(households) {
    const isNotLastHouse = households?.length > 1;
    return Object.keys(households).map((key) => {
      const house = households[key];
      if (this.state.editingHH === house.id) {
        return (
          <div key={key}>
            <MECard className="me-anime-open-in">
              <AddingHouseholdForm
                householdID={house.id}
                name={house.name}
                location={house.location}
                unittype={house.unit_type}
                user={this.props.user}
                editHousehold={this.editHousehold}
                closeForm={() => this.setState({ editingHH: null })}
              />
              <MEButton
                variation="accent"
                className="cancel-btn-position-fix"
                onClick={() =>
                  this.setState({ addingHH: false, editingHH: null })
                }
              >
                Cancel
              </MEButton>
            </MECard>
          </div>
        );
      } else {
        return (
          <div key={key} style={{ position: "relative" }}>
            <MECard style={{ borderRadius: 10 }}>
              <METextView
                type="small"
                style={{ display: "inline-block", color: "black" }}
                icon="fa fa-home"
                mediaType="icon"
              >
                {" "}
                {house.name} &nbsp;
              </METextView>
              <div
                className="put-me-inline pull-right"
                style={{ position: "absolute", right: 20, bottom: "10%" }}
              >
                <MEButton
                  onClick={() =>
                    this.setState({ editingHH: house.id, addingHH: false })
                  }
                  icon="fa fa-edit"
                  iconStyle={{ margin: 0 }}
                  iconSize="large"
                  style={{ padding: "4px 8px", marginRight: 8 }}
                />
                {isNotLastHouse && (
                  <MEButton
                    onClick={() => this.deleteHousehold(house)}
                    className="me-delete-btn"
                    icon="fa fa-trash"
                    iconStyle={{ margin: 0 }}
                    iconSize="large"
                    style={{ padding: "4px 10px" }}
                  />
                )}
              </div>
            </MECard>
          </div>
        );
      }
    });
  }
  addHousehold = (household) => {
    this.props.reduxAddHousehold(household);
    const teams = this.props.user.teams || [];
    teams.forEach((team) => {
      this.props.reduxTeamAddHouse(team);
    });
    // BHN - causes exception - this.addHouseToImpact();
  };
  editHousehold = (household) => {
    this.props.reduxEditHousehold(household);
  };

  deleteHousehold = (household) => {
    if (this.props.user.households.length > 1) {
      apiCall("users.households.remove", { household_id: household.id })
        .then((json) => {
          if (json.success) {
            this.props.reduxRemoveHousehold(household);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        deletingHHError:
          "You need to have at least one household. Try editing the name and location or adding another household before deleting this one",
      });
    }
  };

  removeHouseFromImpact(numDone) {
    this.changeDataByName("EngagedHouseholdsData", -1);
    Object.keys(this.props.user.teams).forEach((key) => {
      this.props.reduxTeamRemoveHouse(this.props.user.teams[key]);
      for (var i = 0; i < numDone; i++) {
        this.props.reduxTeamRemoveAction(this.props.user.teams[key]);
      }
    });
  }
  addHouseToImpact() {
    this.changeDataByName("EngagedHouseholdsData", 1);
  }
  changeDataByName(name, number) {
    const communityData = this.props.communityData || [];
    var data = communityData.filter((data) => {
      return data.name === name;
    })[0];

    const body = {
      data_id: data.id,
      value: data.value + number > 0 ? data.value + number : 0,
    };
    apiCall("data.update", body).then((json) => {
      if (json.success) {
        data = {
          ...data,
          value: data.value + number > 0 ? data.value + number : 0,
        };
        this.props.reduxChangeData(data);
      }
    });
  }

  leaveCommunity = (community) => {
    if (community.id !== this.props.community.id) {
      var newCommunityIds = [];

      this.props.user.communities.forEach((com) => {
        if (com.id !== community.id) {
          newCommunityIds.push(com.id);
        }
      });

      const body = {
        user_id: this.props.user.id,
        community_id: community.id,
      };

      apiCall("communities.leave", body)
        .then((json) => {
          if (json.success) {
            this.props.reduxLeaveCommunity(community);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({
        leaveComError: "You can't leave your home community",
      });
    }
  };

  clearError = () => {
    if (this.state.deletingHHError) {
      this.setState({
        deletingHHError: null,
      });
    }
    if (this.state.leaveComError) {
      this.setState({
        leaveComError: null,
      });
    }
  };

  addDefaultCommunity = () => {
    const body = {
      user_id: this.props.user.id,
      community_id: this.props.community.id,
    };

    if (!this.state.addedDefaultHouse) {
      apiCall("communities.join", body)
        .then((json) => {
          if (json.success) {
            this.props.reduxLoadUserCommunities(json.data.communities);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      this.setState({ addedDefaultHouse: true });
    }
    /** Collects the form data and sends it to the backend */
  };

  addDefaultHousehold = (user, community) => {
    const body = {
      name: "Home",
      unit_type: "RESIDENTIAL",
      location: "",
      user_id: user && user.id,
      email: user && user.email,
      community: community && community.id,
    };

    /** Collects the form data and sends it to the backend */
    apiCall("users.households.add", body)
      .then((json) => {
        if (json.success) {
          this.addHousehold(json.data);
          var householdIds = [];
          this.props.user.households.forEach((household) => {
            householdIds.push(household.id);
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
    teams: store.page.teams,
    communities: store.user.info ? store.user.info.communities : null,
    community: store.page.community,
    communityData: store.page.communityData,
    households: store.user.info ? store.user.info.households : null,
    rsvps: store.page.rsvps,
    links: store.links,
    eq: store.page.equivalences,
    pref_eq: store.user.pref_equivalence || PREF_EQ_DEFAULT,
    fireAuth: store.fireAuth,
    authState: store.authState,
    firebaseAuthSettings: store.firebaseAuthSettings,
  };
};
const mapDispatchToProps = {
  reduxLogout,
  reduxMoveToDone,
  reduxAddHousehold,
  reduxEditHousehold,
  reduxRemoveHousehold,
  reduxLeaveCommunity,
  reduxLoadUserCommunities,
  reduxChangeData,
  reduxLeaveTeam,
  reduxRemoveTeamMember,
  reduxTeamRemoveHouse,
  reduxTeamRemoveAction,
  reduxTeamAddHouse,
  reduxSetPreferredEquivalence,
};
export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(withFirebase(withRouter(ProfilePage)));
