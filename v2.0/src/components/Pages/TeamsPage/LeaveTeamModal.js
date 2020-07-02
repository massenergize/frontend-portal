import React from "react";
import { apiCall } from "../../../api/functions";
import {
  reduxLeaveTeam,
} from "../../../redux/actions/userActions";
import {
  reduxRemoveTeamMember
} from "../../../redux/actions/pageActions";
import { connect } from "react-redux";

class LeaveTeamModal extends React.Component {

  render() {

    const team = this.props.team;

    return (
      <>
        <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal">
            <h4 onClick={() => { this.props.onClose() }} className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
            <h5 style={{ paddingRight: '60px' }}>Are you sure you want to leave <b>{this.props.team.name}</b>?</h5>
            <button
              style={{ marginTop: '10px', marginBottom: '0px' }}

              className="btn btn-success round-me leave-team-btn raise"
              onClick={() => this.leaveTeam(team)}
            >
              Leave Team
            </button>
          </div>
        </div>
        <div className="desc-modal-container">
        </div>
      </>
    );
  }

  leaveTeam = (team) => {
    const body = {
      user_id: this.props.user.id,
      team_id: team.id,
    };
    apiCall(`teams.leave`, body)
      .then((json) => {
        if (json.success) {
          this.props.reduxLeaveTeam(team);
          this.props.reduxRemoveTeamMember({
            team: team,
            member: {
              households: this.props.user.households.length,
              actions:
                this.props.todo && this.props.done
                  ? this.props.todo.length + this.props.done.length
                  : 0,
              actions_completed: this.props.done ? this.props.done.length : 0,
              actions_todo: this.props.todo ? this.props.todo.length : 0,
            },
          });
          this.props.onLeave(team);
        }
        this.props.onClose();
      })
      .catch((error) => {
        console.log(error);
        this.props.onClose();
      });
  };


}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    todo: store.user.todo,
    done: store.user.done,
  };
};

const mapDispatchToProps = {
  reduxLeaveTeam,
  reduxRemoveTeamMember,
};
export default connect(mapStoreToProps, mapDispatchToProps)(LeaveTeamModal);
