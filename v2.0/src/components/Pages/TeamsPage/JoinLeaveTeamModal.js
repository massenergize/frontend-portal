import React from "react";
import { apiCall } from "../../../api/functions";
import {
  reduxJoinTeam,
  reduxLeaveTeam,
} from "../../../redux/actions/userActions";
import {
  reduxAddTeamMember,
  reduxRemoveTeamMember,
} from "../../../redux/actions/pageActions";
import { inThisTeam } from "./utils.js";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import loader from "../../../assets/images/other/loader.gif";
import MEButton from "../Widgets/MEButton";
import METextView from "../Widgets/METextView";
import MEModal from "../Widgets/MEModal";

class JoinLeaveTeamModal extends React.Component {
  constructor(props) {
    super(props);
    const { team, user } = this.props;
    this.leaving = inThisTeam(user, team);
    this.state = {
      loading: false,
      error: null,
    };
  }

  render() {
    const { team, user, links, onClose } = this.props;
    const { loading, error } = this.state;

    let modalContent;
    if (user) {
      modalContent = (
        <>
          {this.leaving ? (
            <METextView style={{ color: "#282828" }}>
              Are you sure you want to leave?
            </METextView>
          ) : (
            <p>
              You will join this team with the display name{" "}
              <i><b>{user.preferred_name}</b></i>.{" "}
              {team.parent && (
                <span>
                  This team is a sub-team of <b>{team.parent.name}</b>, and your
                  stats will also contribute to the parent team!
                </span>
              )}
            </p>
          )}
          <div className="team-modal-button-wrapper">
            <MEButton
              containerStyle={{ marginLeft: "auto" }}
              mediaType="icon"
              variant={this.leaving ? "accent" : "normal"}
              icon={this.leaving ? "fa fa-times" : "fa fa-users"}
              iconStyle={this.leaving ? { color: "red" } : { color: "green" }}
              //   className={`btn btn-success round-me
              // ${this.leaving ? "leave-team-btn" : "join-team-btn"} raise`}
              onClick={() => this.joinLeaveTeam()}
            >
              {this.leaving ? "Yes, Leave" : "Join Now"}
            </MEButton>
            {loading && (
              <img
                src={loader}
                alt=""
                className="team-modal-loader team-modal-inline"
              />
            )}
            {error && (
              <p
                className="error-p team-modal-error-p team-modal-inline"
              >
                {error}
              </p>
            )}
          </div>
        </>
      );
    } else {
      modalContent = (
        <p>
          You must <Link to={links.signin}>sign in or create a profile</Link>{" "}
          to {this.leaving ? "leave" : "join"} this team
        </p>
      );
    }

    return (
      <>
        <MEModal size="md" contentStyle={{ width: "100%" }} closeModal={() => onClose()}>
          <h4>
            Join or leave the team <b>{team && team.name}</b>
          </h4>
          {modalContent}
        </MEModal>
        {/* <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal">
            <h4 onClick={() => onClose()} className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
            <h4 style={{ paddingRight: '60px' }}>{this.leaving ? "Leave" : "Join"} <b>{team.name}</b></h4>
            <br />
            {modalContent}
          </div>
        </div>
        <div className="desc-modal-container">
        </div> */}
      </>
    );
  }

  joinLeaveTeam = async () => {
    const { team, user, todo, done, onComplete } = this.props;
    const reduxJoinLeaveTeam = this.leaving
      ? this.props.reduxLeaveTeam
      : this.props.reduxJoinTeam;
    const reduxAddRemoveMember = this.leaving
      ? this.props.reduxRemoveTeamMember
      : this.props.reduxAddTeamMember;
    const endpoint = this.leaving ? "teams.leave" : "teams.join";
    const body = {
      user_id: user.id,
      team_id: team.id,
    };

    try {
      this.setState({ loading: true });

      const json = await apiCall(endpoint, body);
      if (json.success) {
        reduxJoinLeaveTeam(team);
        reduxAddRemoveMember({
          team: team,
          member: {
            households: user.households.length,
            actions: todo && done ? todo.length + done.length : 0,
            actions_completed: done ? done.length : 0,
            actions_todo: todo ? todo.length : 0,
          },
        });
        onComplete(team);
      } else {
        this.setState({ error: json.error });
      }
    } catch (err) {
      this.setState({ error: err.toString() });
    } finally {
      this.setState({ loading: false });
    }
  };
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
    todo: store.user.todo,
    done: store.user.done,
  };
};

const mapDispatchToProps = {
  reduxJoinTeam,
  reduxAddTeamMember,
  reduxLeaveTeam,
  reduxRemoveTeamMember,
};

export default connect(mapStoreToProps, mapDispatchToProps)(JoinLeaveTeamModal);
