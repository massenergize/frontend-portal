import React from "react";
import { apiCall } from "../../../api/functions";
import { reduxJoinTeam } from "../../../redux/actions/userActions";
import { reduxAddTeamMember } from "../../../redux/actions/pageActions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class JoinTeamModal extends React.Component {

  render() {

    const { team, user, links, onClose } = this.props;

    let modalContent;
    if (user) {

      modalContent = (
        <>
          <p>
            You will join this team with the display name <i>{user.preferred_name}</i>. {team.parent && <span>This team is a sub-team of <b>{team.parent.name}</b>, and your stats will also contribute to the parent team!</span>}
          </p>
          <button
            style={{ marginTop: '10px', marginBottom: '0px' }}
            onClick={() => this.joinTeam()}
            type="submit"
            className="btn btn-success round-me join-team-btn raise"
          >
            Join Team
         </button>
        </>
      );
    } else {
      modalContent = <p>You must <Link to={links.signin}>sign in or create an account</Link> to join this team</p>;
    }

    return (
      <>
        <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal">
            <h4 onClick={() => onClose()} className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
            <h4 style={{ paddingRight: '60px' }}>Join <b>{team.name}</b></h4>
            <br />
            {modalContent}
          </div>
        </div>
        <div className="desc-modal-container">
        </div>
      </>
    );
  }

  joinTeam = async () => {
    const { team, user, todo, done,
      reduxJoinTeam, reduxAddTeamMember,
      onJoin } = this.props;

    const body = {
      user_id: user.id,
      team_id: team.id
    };
    try {
      const json = await apiCall("teams.join", body)
      if (json.success) {
        reduxJoinTeam(team);
        reduxAddTeamMember({
          team: team,
          member: {
            households: user.households.length,
            actions: todo && done ? todo.length + done.length : 0,
            actions_completed: done ? done.length : 0,
            actions_todo: todo ? todo.length : 0,
          },
        });
        onJoin(team);
      } else {
        //TODO: set error state
      }
    }
    catch (err) {
      //TODO: set error state
    };
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
  reduxAddTeamMember
};

export default connect(mapStoreToProps, mapDispatchToProps)(JoinTeamModal);
