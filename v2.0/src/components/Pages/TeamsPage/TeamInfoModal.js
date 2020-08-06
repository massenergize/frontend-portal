import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { reduxLoadTeamsPage } from "../../../redux/actions/pageActions";

class TeamInfoModal extends React.Component {

  //TODO: things added by Brad that would need a bunch more work: multiple photos, videos

  render() {

    const { team, onClose, teamsPage } = this.props;

    //TODO: disallow a team that itself has sub-teams from setting a parent...right?

    //can set parent teams that are not ourselves AND don't have parents themselves (i.e. aren't sub-teams)
    const parentTeamOptions = teamsPage.map(teamStats => teamStats.team)
      .filter(_team => ((!team || _team.id !== team.id) && !_team.parent));

    //TODO: need a solution for adding OTHER admins (append-only?)
    //also, make sure that the person creating the team becomes an admin...

    let modalContent;
    if (this.props.user) {

      const buttonStyle = { marginTop: '10px', marginBottom: '0px', padding: '10px 40px' };

      const submitButton = team ?
        <button style={buttonStyle} type="submit"
          className="btn btn-success round-me contact-admin-btn-new raise">
          Update
        </button> :
        <button style={buttonStyle} type="submit"
          className="btn btn-success round-me join-team-btn raise">
          Create
        </button>;

      modalContent = <form id="team-team-info"
        onSubmit={(e) => {
          e.preventDefault();
          this.callAPI();
        }}>

        <label htmlFor="team-name"><u>Name</u></label>
        <input id="team-name" type="text" name="team-name" className="form-control"
          value={team && team.name} maxLength={100} reqiured />

        <label htmlFor="team-tagline"><u>Tagline</u></label>
        <input id="team-tagline" name="team-tagline" className="form-control"
          value={team && team.tagline} maxLength={100} required />

        <label htmlFor="team-description"><u>Description</u></label>
        <textarea id="team-description" name="team-description" className="form-control" rows={3}
          value={team && team.description} maxLength={10000} required />

        <label htmlFor="team-parent-team"><u>Parent Team</u> &nbsp;</label>
        <select name="team-parent-team" id="team-parent-team" form="team-info" defaultValue={
          (team && team.parent) ? team.parent.id : ""
        }>
          <option value="">NONE</option>
          {parentTeamOptions.map(team => <option value={team.id}>{team.name}</option>)}
        </select>

        <div style={{ display: 'block' }}>
          <label htmlFor="team-logo"><u>Logo</u></label>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {team && team.logo &&
              <div style={{ display: 'block' }}>
                <small>Current:</small>
                <img src={team.logo.url} style={{ maxWidth: '100px', maxHeight: '50px' }} />
              </div>
            }
            <input style={{ display: 'inline-block' }} id="team-logo" accept="image/*" type="file" name="team-logo" className="form-control" />
          </div>
        </div>

        {submitButton}

      </form>
    } else {
      //the "edit team" button won't render if user isn't signed in, so can just mention creating a team
      modalContent = <p>You must <Link to={this.props.links.signin}>sign in or create an account</Link> to create a team.</p>;
    }

    return (
      <>
        <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal">
            <h4 onClick={() => { onClose() }} className=" modal-close-x round-me"><span className="fa fa-close"></span></h4>
            <h4 style={{ paddingRight: '60px' }}>{team ? <span>Edit <b>{team.name}</b></span> : "Create Team"}</h4>
            <div style={{ overflowY: 'auto', maxHeight: '90%' }}>
              <div className="boxed_wrapper">
                {modalContent}
              </div>
            </div>
          </div>
        </div>
        <div className="desc-modal-container">
        </div>
      </>
    );
  }

  getChangedData = (team, data) => {
    const ret = {};
    Object.keys(data).forEach(field => {
      if (data[field] !== team[field]) {
        ret[field] = data[field];
      }
    });
    return ret;
  }

  //TODO: I have a bit of work to do making the data object valid for the create/update calls
  //look at the API code
  getData = () => {
    const { team } = this.props;

    const data = {};
    ['name', 'tagline', 'description', 'parent-team', 'logo']
      .forEach(field => data[field] = document.getElementById(`team-${field}`).value);
    if (team) data = this.getChangedData(data, team);

    return data;
  }

  callAPI = async () => {
    const { team, onComplete, reduxLoadTeamsPage } = this.props;

    const data = this.getData();
    const url = team ? "teams.update" : "teams.create";

    //TODO: what to do on error?
    try {
      const json = await apiCall(url, data);
      if (json.success) {
        reduxLoadTeamsPage(); //TODO: make sure this does what I think it does
        onComplete(team.id);
      } else {
      }
    } catch (err) {
    }
  }

}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
    teamsPage: store.page.teamsPage,
  };
};
const mapDispatchToProps = {
  reduxLoadTeamsPage
};

export default connect(mapStoreToProps, mapDispatchToProps)(TeamInfoModal);
