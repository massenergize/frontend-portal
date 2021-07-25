import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { apiCall } from "../../../api/functions";
import LoadingCircle from "../../Shared/LoadingCircle";
import Cart from "../../Shared/Cart";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import Counter from "./Counter";
import AddingHouseholdForm from "./AddingHouseholdForm";
import EditingProfileForm from "./EditingProfileForm";
// import EventCart from "./EventCart";
import { withFirebase } from "react-redux-firebase";

import {
  reduxMoveToDone,
  reduxAddHousehold,
  reduxEditHousehold,
  reduxRemoveHousehold,
  reduxLeaveCommunity,
  reduxLoadUserCommunities,
  reduxLeaveTeam,
  reduxLogout,
} from "../../../redux/actions/userActions";
import {
  reduxChangeData,
  reduxRemoveTeamMember,
  reduxTeamRemoveHouse,
  reduxTeamRemoveAction,
  reduxTeamAddHouse,
} from "../../../redux/actions/pageActions";
// import { watchFile } from 'fs';
// import Tooltip from "../../Shared/Tooltip";
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
import { sumOfCarbonScores } from "../../Utils";

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
    };
  }

  componentDidMount() {
    // disable the registration protocol to prevent the form from ever showing again, until enabled
    localStorage.removeItem("reg_protocol");
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
  render() {
    //console.log("I am the props", this.props.teams);
    if (!this.props.user) {
      return <Redirect to={this.props.links.signin}> </Redirect>;
    }

    if (!this.props.user) {
      // can this execute?
      this.props.firebase.auth().signOut();
      this.props.reduxLogout();
    }

    const myHouseholds = this.props.user.households || [];
    // const myCommunities = this.props.user.communities || [];

    if (!this.props.teams) {
      return <LoadingCircle />;
    }

    if (myHouseholds.length === 0 && !this.state.addedHouse) {
      this.setState({ addedHouse: true });
      this.addDefaultHousehold(this.props.user, this.props.community);
    }

    /* This is not where communities get automatically added!
    if (this.props.community) {
      if (
        myCommunities.filter((com) => {
          return com.id === this.props.community.id;
        }).length === 0
      ) {
        this.addDefaultCommunity();
      }
    }
    */
    //capturing the props in a JSON object that represents a user
    const { user } = this.props;
    return (
      <>
        <div
          className="boxed_wrapper"
          onClick={this.clearError}
          style={{ minHeight: 1950 }}
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
                            <Counter
                              end={sumOfCarbonScores(this.props.done || [])}
                              unit={"lbs CO2"}
                              icon={"fa fa-leaf"}
                              title={"Impact"}
                              info={
                                "Amount your yearly carbon footprint is reduced through the actions you've taken."
                              }
                            />
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
                          <div className=" column col-lg-4 col-md-4 col-md-4 col-sm-4 col-xs-6 card2">
                            <Counter
                              end={(this.props.done || [])
                                .map((t) =>
                                  t.action && t.action.calculator_action
                                    ? t.action.calculator_action.average_points
                                    : 0
                                )
                                .reduce((partial_sum, a) => partial_sum + a, 0)}
                              unit={"lbs CO2"}
                              icon={"fa fa-leaf"}
                              title={"Impact"}
                              info={
                                "Amount your yearly carbon footprint is reduced through the actions you've taken."
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
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
                  {/* <table className="profile-table" style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <th> Your Households </th>
                        <th />
                        <th />
                      </tr>
                      {this.renderHouseholds(user.households)}
                      {!this.state.editingHH ? (
                        <tr>
                          <td colSpan={3} style={{ textAlign: "center" }}>
                            {this.state.addingHH ? (
                              <>
                                <AddingHouseholdForm
                                  user={this.props.user}
                                  addHousehold={this.addHousehold}
                                  closeForm={() =>
                                    this.setState({ addingHH: false })
                                  }
                                />
                                <MEButton
                                  variation="accent"
                                  onClick={() =>
                                    this.setState({ addingHH: false })
                                  }
                                >
                                  Cancel
                                </MEButton>
                              </>
                            ) : (
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
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table> */}
                  {this.state.deletingHHError ? (
                    <p className="text-danger"> {this.state.deletingHHError}</p>
                  ) : null}
                  <br />

                  {/* --------------- Dont display communities part when a user is editing -------- */}
                  {!this.state.editingHH && this.showCommunitiesSection()}

                  {/* 
                  <table className="profile-table" style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <th> Your Communities </th>
                        <th></th>
                      </tr>
                      {this.renderCommunities(user.communities)}
                      <tr>
                        {this.state.joiningCom ? (
                          <td colSpan={2}>
                            <JoiningCommunityForm
                              closeForm={() =>
                                this.setState({ joiningCom: false })
                              }
                            />
                          </td>
                        ) : (
                          <td colSpan={2} style={{ textAlign: "center" }}>
                            <MEButton
                              onClick={() =>
                                this.setState({ joiningCom: true })
                              }
                            >
                              Join another Community
                            </MEButton>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table> */}
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
                  {true ? (
                    <Cart
                      title="Completed Actions"
                      actionRels={this.props.done ? this.props.done : []}
                      status="DONE"
                    />
                  ) : null}
                  {true ? (
                    <Cart
                      title="To Do List"
                      actionRels={this.props.todo ? this.props.todo : []}
                      status="TODO"
                    />
                  ) : null}

                  {/* {this.props.rsvps ? (
                    <EventCart
                      title="Event RSVPs"
                      eventRSVPs={this.props.rsvps.filter(
                        (rsvp) =>
                          rsvp.attendee &&
                          rsvp.attendee.id === this.props.user.id
                      )}
                    />
                  ) : null} */}
                  <center>
                    {/* <MEButton
                      onClick={() => this.setState({ printing: true })}
                      variation="union"
                      style={{ fontSize: 14 }}
                    >
                      Summary Of Your Actions
                    </MEButton> */}
                  </center>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  renderForm = (form) => {
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
              <Dropdown.Item
                onClick={() => this.setState({ editingProfileForm: "edit" })}
                className="dropdown-item dropdown-item me-dropdown-theme-item force-padding-20"
              >
                Edit Profile
              </Dropdown.Item>
              {this.props.auth.providerData &&
              this.props.auth.providerData.length === 1 &&
              this.props.auth.providerData[0].providerId === "password" ? (
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
                onClick={() => this.setState({ editingProfileForm: "delete" })}
                className="dropdown-item dropdown-item me-dropdown-theme-item force-padding-20"
              >
                Delete Profile
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          &nbsp;&nbsp;
        </h4>
        <p> {this.state.message ? this.state.message : ""} </p>
        {form === "edit" ? (
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
        ) : null}
        {form === "delete" ? (
          <DeleteAccountForm
            closeForm={(message = "") =>
              this.setState({
                editingProfileForm: null,
                message: message ? message : null,
              })
            }
          />
        ) : null}
        {form === "password" ? (
          <ChangePasswordForm
            closeForm={(message = "") =>
              this.setState({
                editingProfileForm: null,
                message: message ? message : null,
              })
            }
          />
        ) : null}
        {form === "email" ? (
          <ChangeEmailForm
            closeForm={(message = "") =>
              this.setState({
                editingProfileForm: null,
                message: message ? message : null,
              })
            }
            email={this.props.user.email}
          />
        ) : null}
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
    const currentCommunityTeamIDs =
        this.props.teams.map((team) => team.team.id);

    //console.log("currentCommunityTeamIDs",currentCommunityTeamIDs)
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
                <MEButton
                  onClick={() => this.deleteHousehold(house)}
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
          console.log(json);
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
    auth: store.firebase.auth,
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
};
export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(withFirebase(ProfilePage));
