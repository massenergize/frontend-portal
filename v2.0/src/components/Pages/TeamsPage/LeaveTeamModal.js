import React from "react";
import { apiCall } from "../../../api/functions";
import { reduxLeaveTeam } from "../../../redux/actions/userActions";
import { reduxRemoveTeamMember } from "../../../redux/actions/pageActions";
import { connect } from "react-redux";

class LeaveTeamModal extends React.Component {

  render() {

    const { team, onClose } = this.props;

    return (
      <>
        <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal">
            <h4 onClick={() => onClose()} className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
            <h5 style={{ paddingRight: '60px' }}>Are you sure you want to leave <b>{team.name}</b>?</h5>
            <button
              style={{ marginTop: '10px', marginBottom: '0px' }}
              className="btn btn-success round-me leave-team-btn raise"
              onClick={() => this.leaveTeam()}
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

  leaveTeam = async () => {
    const { team, user, todo, done,
      reduxLeaveTeam, reduxRemoveTeamMember,
      onLeave } = this.props;

    const body = {
      user_id: user.id,
      team_id: team.id,
    };
    try {
      const json = await apiCall(`teams.leave`, body)
      if (json.success) {
        reduxLeaveTeam(team);
        reduxRemoveTeamMember({
          team: team,
          member: {
            households: user.households.length,
            actions: todo && done ? todo.length + done.length : 0,
            actions_completed: done ? done.length : 0,
            actions_todo: todo ? todo.length : 0,
          },
        });
        onLeave(team);
      }
      else {
        //TODO: set error state
      }
    } catch (err) {
      //TODO: set error state
    };
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
