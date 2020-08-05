import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";


class TeamInfoModal extends React.Component {

  // things added by Brad that would need a bunch more work to the front-end: multiple photos, videos
  // how many nested parent-sub teams can there be???
  //    if only one layer, need to stop teams that are parents from assigning themselves a parent
  //    if more than one layer, things will become a nightmare otherwise

  render() {

    const { team, onClose, teamsPage } = this.props;

    //can set parent teams that are not ourselves AND don't have parents themselves (i.e. aren't sub-teams)
    const parentTeamOptions = teamsPage.map(teamStats => teamStats.team)
      .filter(_team => ((!team || _team.id !== team.id) && !_team.parent));

    //TODO: need to add input for assigning other admins (append-only?)

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

      modalContent = <form id="team-info"
        onSubmit={(e) => {
          e.preventDefault();
          if (team) this.updateTeam();
          else this.createTeam();
        }}>

        <label htmlFor="name"><u>Name</u></label>
        <input id="name" type="text" name="name" className="form-control"
          value={team && team.name} maxLength={100} reqiured />

        <label htmlFor="tagline"><u>Tagline</u></label>
        <input id="tagline" name="tagline" className="form-control"
          value={team && team.tagline} maxLength={100} required />

        <label htmlFor="description"><u>Description</u></label>
        <textarea id="description" name="description" className="form-control" rows={3}
          value={team && team.description} maxLength={10000} required />

        <label htmlFor="parent-team"><u>Parent Team</u> &nbsp;</label>
        <select name="parent-team" id="parent-team" form="team-info" defaultValue={
          (!team || !team.parent) ? "" : team.parent.id
        }>
          <option value="">None</option>
          {parentTeamOptions.map(team => <option value={team.id}>{team.name}</option>)}
        </select>

        <div style={{ display: 'block' }}>
          <label htmlFor="logo"><u>Logo</u></label>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {team && team.logo &&
              <div style={{ display: 'block' }}>
                <small>Current:</small>
                <img src={team.logo.url} style={{ maxWidth: '100px', maxHeight: '50px' }} />
              </div>
            }
            <input style={{ display: 'inline-block' }} id="logo" accept="image/*" type="file" name="logo" className="form-control" />
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
            <div style={{ overflowY: 'auto', maxHeight: '90%'}}>
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

  //TODO: implement functions for accessing fields and doing API calls for both create and edit
  //make sure that they call onComplete callback and passes it the team ID
  //for updateTeam(), check which of the values have changed and only include new ones in API call

}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
    teamsPage: store.page.teamsPage,
  };
};

export default connect(mapStoreToProps, null)(TeamInfoModal);
