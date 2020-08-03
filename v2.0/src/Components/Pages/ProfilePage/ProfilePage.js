import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import URLS from "../../../api/urls";
import { apiCall, postJson } from "../../../api/functions";
import LoadingCircle from "../../Shared/LoadingCircle";
import Cart from "../../Shared/Cart";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";
import Counter from "./Counter";
import AddingHouseholdForm from "./AddingHouseholdForm";
import EditingProfileForm from "./EditingProfileForm";
import EventCart from "./EventCart";
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
import Tooltip from "../../Shared/Tooltip";
import JoiningCommunityForm from "./JoiningCommunityForm";
import PrintCart from "../../Shared/PrintCart";
import DeleteAccountForm from "./DeleteAccountForm";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeEmailForm from "./ChangeEmailForm";
import Dropdown from "react-bootstrap/Dropdown";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      addedHouse: false,

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
  render() {
    if (!this.props.user) {
      return <Redirect to={this.props.links.signin}> </Redirect>;
    }

    var token = localStorage.getItem("idToken");
    if (!token && this.props.user) {
      console.log("Background logout!");
      this.props.firebase.auth().signOut();
      this.props.reduxLogout();
    }
    const myHouseholds = this.props.user.households || [];
    const myCommunities = this.props.user.communities || [];

    if (!this.props.teamsPage) {
      return <LoadingCircle />;
    }

    if (myHouseholds.length === 0 && !this.state.addedHouse) {
      this.setState({ addedHouse: true });
      this.addDefaultHousehold(this.props.user, this.props.community);
    }
    if (this.props.community) {
      if (
        myCommunities.filter((com) => {
          return com.id === this.props.community.id;
        }).length === 0
      ) {
        this.addDefaultCommunity();
      }
    }
    const { user } = this.props;

    return (
      <>
        <div className="boxed_wrapper" onClick={this.clearError}>
          <BreadCrumbBar links={[{ name: "Profile" }]} />
          <div className="container">
            {this.state.printing ? (
              <>
                <PrintCart />
                <center>
                  <button
                    className="thm-btn text-center print-cancel-style"
                    style={{
                      background: "crimson",
                      color: "white",
                      marginBottom: 20,
                      padding: "10px 84px !important",
                    }}
                    onClick={() => this.setState({ printing: false })}
                  >
                    {" "}
                    Cancel
                  </button>
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
                                "A persons Carbon footprint is the amount of greenhouse gas (GHG) emissions from their energy use and personal consumption.  These emissions are measured in pounds of CO2 per year. The Impact reported here is the estimated reduction annually from the actions completed, using typical average assumptions."
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
                                "A persons Carbon footprint is the amount of greenhouse gas (GHG) emissions from their energy use and personal consumption.  These emissions are measured in pounds of CO2 per year. The Impact reported here is the estimated reduction annually from the actions completed, using typical average assumptions."
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <table className="profile-table" style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <th> Your Teams <small>(* outside this community)</small> </th>
                      </tr>
                      {this.renderTeams(user.teams)}
                      <tr>
                        <td  align="center">
                          <Link
                            className="thm-btn btn-finishing"
                            to={this.props.links.teams}
                            style={{ margin: "5px" }}
                          >
                            View all Teams
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <br />
                  <table className="profile-table" style={{ width: "100%" }}>
                    <tbody>
                      <tr>
                        <th> Your Households </th>
                        <th />
                        <th />
                      </tr>
                      {this.renderHouseholds(user.households)}
                      {!this.state.editingHH ? (
                        <tr>
                          <td colSpan={3}>
                            {this.state.addingHH ? (
                              <>
                                <AddingHouseholdForm
                                  user={this.props.user}
                                  addHousehold={this.addHousehold}
                                  closeForm={() =>
                                    this.setState({ addingHH: false })
                                  }
                                />
                                <button
                                  className=""
                                  onClick={() =>
                                    this.setState({ addingHH: false })
                                  }
                                  style={{
                                    color: "white",
                                    width: "99%",
                                    padding: 13,
                                    borderRadius: 6,
                                    background: "indianred",
                                    borderColor: "indianred",
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                className="thm-btn btn-finishing"
                                onClick={() =>
                                  this.setState({
                                    addingHH: true,
                                    editingHH: null,
                                  })
                                }
                              >
                                If you have another household, let us know
                              </button>
                            )}
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                  {this.state.deletingHHError ? (
                    <p className="text-danger"> {this.state.deletingHHError}</p>
                  ) : null}
                  <br />

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
                          <td colSpan={2}>
                            <button
                              className="thm-btn btn-finishing"
                              onClick={() =>
                                this.setState({ joiningCom: true })
                              }
                            >
                              Join another Community
                            </button>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
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
                  }}
                >
                  {/* <h3 className="col-12 text-right">
                                        <SignOutButton style={{ display: 'inline-block' }} />
                                    </h3>
                                    <br /> */}
                  {this.props.todo ? (
                    <Cart
                      title="To Do List"
                      actionRels={this.props.todo}
                      status="TODO"
                    />
                  ) : null}
                  {this.props.done ? (
                    <Cart
                      title="Completed Actions"
                      actionRels={this.props.done}
                      status="DONE"
                    />
                  ) : null}
                  {this.props.rsvps ? (
                    <EventCart
                      title="Event RSVPs"
                      eventRSVPs={this.props.rsvps.filter(
                        (rsvp) =>
                          rsvp.attendee &&
                          rsvp.attendee.id === this.props.user.id
                      )}
                    />
                  ) : null}
                  <center>
                    <button
                      className="text-center summary-finish raise"
                      style={{ marginBottom: 30 }}
                      onClick={() => this.setState({ printing: true })}
                    >
                      {" "}
                      Summary Of Your Actions
                    </button>
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
              style={{ color: "#aaa", background: "white", border: "white" }}
            ></Dropdown.Toggle>
            <Dropdown.Menu
              style={{
                borderTop: "5px solid #8dc63f",
                borderRadius: "0",
                padding: "0",
              }}
            >
              <Dropdown.Item
                onClick={() => this.setState({ editingProfileForm: "edit" })}
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
                  >
                    Change Password
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      this.setState({ editingProfileForm: "email" })
                    }
                  >
                    Change Email
                  </Dropdown.Item>
                </>
              ) : null}
              <Dropdown.Item
                onClick={() => this.setState({ editingProfileForm: "delete" })}
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
        <tr>
          <td colSpan={2}>You haven't joined any communities yet</td>
        </tr>
      );
    return Object.keys(communities).map((key) => {
      const community = communities[key];
      return (
        <tr key={key}>
          <td>
            {" "}
            <a href={`/${community.subdomain}`}> {community.name} </a>
          </td>
          <td>
            {" "}
            <button
              className="remove-btn"
              onClick={() => this.leaveCommunity(community)}
            >
              {" "}
              <i className="fa fa-trash"></i>
            </button>{" "}
          </td>
        </tr>
      );
    });
  }
  renderTeams(teams) {
    if (!teams) return null;

    const currentCommunityTeamIDs = this.props.teamsPage && this.props.teamsPage.map(teamStats => teamStats.team.id);
    const inThisCommunity = (team) => ( currentCommunityTeamIDs && currentCommunityTeamIDs.includes(team.id)) ;

    return Object.keys(teams).map((key) => {
      const team = teams[key];

      return (
        <tr key={key}>
          <td>
            {inThisCommunity(team) ?
              <Link to={`${this.props.links.teams + "/" + team.id} `}><h6>{team.name}</h6></Link>
              :
              <>
                <h6>{team.name}*</h6>
              </>
            }
            {team.tagline}
              </p>
            }
          </td>
        </tr>
      );
    });
  }
  renderHouseholds(households) {
    return Object.keys(households).map((key) => {
      const house = households[key];
      if (this.state.editingHH === house.id) {
        return (
          <tr key={key}>
            <td colSpan={3}>
              <AddingHouseholdForm
                householdID={house.id}
                name={house.name}
                location={house.location}
                unittype={house.unit_type}
                user={this.props.user}
                editHousehold={this.editHousehold}
                closeForm={() => this.setState({ editingHH: null })}
              />
              <button
                className=""
                onClick={() =>
                  this.setState({ addingHH: false, editingHH: null })
                }
                style={{
                  color: "white",
                  width: "99%",
                  padding: 13,
                  borderRadius: 6,
                  background: "indianred",
                  borderColor: "indianred",
                }}
              >
                Cancel
              </button>
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={key}>
            <td>
              {house.name} &nbsp;
              <Tooltip
                title={house.name}
                text={
                  house.location
                    ? "Location: " +
                      house.location +
                      ", Type: " +
                      house.unit_type
                    : "No location for this household, Type: " + house.unit_type
                }
                dir="right"
              >
                <span
                  className="fa fa-info-circle"
                  style={{ color: "#428a36" }}
                ></span>
              </Tooltip>
            </td>
            <td>
              <button className="edit-btn">
                {" "}
                <i
                  className="fa fa-edit"
                  onClick={() =>
                    this.setState({ editingHH: house.id, addingHH: false })
                  }
                ></i>{" "}
              </button>
            </td>
            <td>
              <button className="remove-btn">
                {" "}
                <i
                  className="fa fa-trash"
                  onClick={() => this.deleteHousehold(house)}
                ></i>{" "}
              </button>
            </td>
          </tr>
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
      value: data.value + number > 0 ? data.value + number : 0,
    };
    postJson(URLS.DATA + "/" + data.id, body).then((json) => {
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
          //console.log(json);
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

    /** Collects the form data and sends it to the backend */
    apiCall("communities.join", body)
      .then((json) => {
        if (json.success) {
          this.props.reduxLoadUserCommunities(json.data.communities);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
    teamsPage: store.page.teamsPage,
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
