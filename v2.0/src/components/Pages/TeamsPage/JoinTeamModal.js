import React from "react";
import { apiCall } from "../../../api/functions";
import {
  reduxJoinTeam, reduxLogin
} from "../../../redux/actions/userActions";
import {
  reduxAddTeamMember
} from "../../../redux/actions/pageActions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class JoinTeamModal extends React.Component {

  render() {

    const team = this.props.team;

    let modalContent;
    if (this.props.user) {

      const preferredName = this.props.user.preferred_name;

      modalContent = (
        <form onSubmit={(e) => {
          e.preventDefault();
          if (preferredName) {
            this.joinTeam(team);
          } else {
            const input = document.getElementById('preferred-name').value;
            this.updatePreferredName(input);
            this.joinTeam(team);
          }
        }
        }>
          {preferredName ?
            <p>
              You will join this team with the preferred name <i>{preferredName}</i>
            </p>
            :
            <>
              <p>You must enter a preferred name to join the team.</p>
              <input className="form-control" type="text" name="preferred-name" id="preferred-name" placeholder="Preferred name..." required />
            </>
          }
          <button
            style={{ marginTop: '10px', marginBottom: '0px' }}
            type="submit"
            className="btn btn-success round-me join-team-btn raise"
          >
            Join Team
         </button>
        </form>
      );
    } else {
      modalContent = <p>You must <Link to={this.props.links.signin}>sign in or create an account</Link> to join this team</p>;
    }

    return (
      <>
        <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal">
            <h4 onClick={() => { this.props.onClose() }} className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
            <h4 style={{ paddingRight: '60px' }}>Join <b>{this.props.team.name}</b></h4>
            <br />
            {modalContent}
          </div>
        </div>
        <div className="desc-modal-container">
        </div>
      </>
    );
  }

  updatePreferredName = preferredName => {
    const body = {
      id: this.props.user.id,
      preferred_name: preferredName
    }
    apiCall("users.update", body)
      .then((json) => {
        if (json.success) {
          this.props.reduxLogin(preferredName);
        }
      }).catch(error => {
        console.log(error);
      });
  }

  joinTeam = team => {
    const body = {
      user_id: this.props.user.id,
      team_id: team.id
    };
    apiCall("teams.join", body)
      .then((json) => {
        if (json.success) {
          this.props.reduxJoinTeam(team);
          this.props.reduxAddTeamMember({
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
          this.props.onJoin(team);
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
    links: store.links,
    todo: store.user.todo,
    done: store.user.done,
  };
};

const mapDispatchToProps = {
  reduxJoinTeam,
  reduxAddTeamMember,
  reduxLogin
};
export default connect(mapStoreToProps, mapDispatchToProps)(JoinTeamModal);
