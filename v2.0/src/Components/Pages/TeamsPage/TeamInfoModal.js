import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { reduxLoadTeamsPage } from "../../../redux/actions/pageActions";
import { reduxJoinTeam } from "../../../redux/actions/userActions";
import loader from '../../../assets/images/other/loader.gif';


class TeamInfoModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null
    }
  }

  render() {
    const { team, onClose, teamsStats, user } = this.props;
    const { loading, error } = this.state;

    //if other teams have us as a parent, can't set a parent ourselves
    //from that point, can set parent teams that are not ourselves AND don't have parents themselves (i.e. aren't sub-teams)
    const teams = teamsStats.map(teamStats => teamStats.team);
    const parentTeamOptions = (!team || teams.filter(_team =>
      _team.parent && _team.parent.id === team.id).length === 0)
      && teams.filter(_team => ((!team || _team.id !== team.id) && !_team.parent));

    let modalContent;
    if (user) {

      modalContent = <form id="team-info"
        onSubmit={(e) => {
          e.preventDefault();
          this.callAPI();
        }}>

        <label htmlFor="team-name"><u>Name</u>* <br />
          <small>What your team will be known by.</small>
        </label>
        <input id="team-name" type="text" name="team-name" className="form-control"
          defaultValue={team && team.name} maxLength={100} reqiured />

        <label htmlFor="team-tagline"><u>Tagline</u>* <br />
          <small>A catchy slogan for your team.</small>
        </label>
        <input id="team-tagline" type="text" name="team-tagline" className="form-control"
          defaultValue={team && team.tagline} maxLength={100} required />

        <label htmlFor="team-description"><u>Description</u>* <br />
          <small>Describe your team. Who are you and what brings you together?</small>
        </label>
        <textarea id="team-description" name="team-description" className="form-control" rows={3}
          defaultValue={team && team.description} maxLength={10000} required />

        {parentTeamOptions &&
          <>
            <label htmlFor="team-parent_id"><u>Parent Team</u>  <br />
              <small>You can pick a parent team to which all of your members' actions will also automatically contribute.</small>
            </label>
            <select name="team-parent_id" id="team-parent_id" form="team-info" defaultValue={
              (team && team.parent) ? team.parent.id : ""
            }>
              <option value="">NONE</option>
              {parentTeamOptions.map(team => <option key={team.id} value={team.id}>{team.name}</option>
              )}
            </select>
          </>
        }

        {!team &&
          <>
            <label htmlFor="team-admin_emails"><u>Additional Admin Emails</u> <br />
              <small>A comma-separated list of emails corresponding with the MassEnergize users you wish to make admins of this team. You will automatically be made an admin.</small>
            </label>
            <input id="team-admin_emails" name="team-admin_emails" className="form-control" />
          </>
        }

        <div style={{ display: 'block' }}>
          <label htmlFor="team-logo"><u>Logo</u> <br />
            <small>You can select a logo to be displayed alongside your team on the community portal.</small>
          </label>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {team && team.logo &&
              <div style={{ display: 'block' }}>
                <small>Current:</small>
                <img src={team.logo.url} alt="" style={{ maxWidth: '100px', maxHeight: '50px' }} />
              </div>
            }
            <input style={{ display: 'inline-block' }} id="team-logo" accept="image/*" type="file" name="team-logo" className="form-control" />
          </div>
        </div>

        {!team &&
          <><br />
            <small><b>Your team will need approval from a Community Admin before displaying. You will recieve an email when this happens.</b></small>
          </>}

        <div className="team-modal-button-wrapper">
          <button type="submit"
            className={`btn btn-success round-me ${team ? "contact-admin-btn-new" : "join-team-btn"} raise`}>
            {team ? "Update" : "Create"}
          </button>
          {loading && <img src={loader} className="team-modal-loader team-modal-inline" />}
          {error && <p className className="error-p team-modal-error-p team-modal-inline">{error}</p>}
        </div>

      </form >
    } else {
      //the "edit team" button won't render if user isn't signed in, so can just mention creating a team
      modalContent = <p>You must <Link to={this.props.links.signin}>sign in or create an account</Link> to create a team.</p>;
    }

    return (
      <>
        <div style={{ width: '100%', height: "100%" }}>
          <div className="team-modal" style={{ height: "90%" }}>
            <h4 onClick={() => { onClose() }} className=" modal-close-x round-me">
              <span className="fa fa-close"></span>
            </h4>
            <h4 style={{ paddingRight: '60px' }}>
              {team ? <span>Edit <b>{team.name}</b></span> : "Create Team"}
            </h4>
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

  getValue = (field) => {
    const input = document.getElementById(`team-${field}`);
    if (!input) return null;
    if (field === 'logo') {
      return input.files[0];
    }
    return input.value;
  }

  isChanged = (field, value, team) => {
    if (['name', 'tagline', 'description'].includes(field))
      return value !== team[field];
    if (field === 'parent_id')
      return (!team.parent && value) || (team.parent.id !== value);
    if (field === 'logo' && value) //if any image is uploaded, it's new
      return true;
  }

  getData = () => {
    const { team, communityData, user } = this.props;
    const data = {};
    if (team) {
      ['name', 'tagline', 'description', 'parent_id', 'logo']
        .forEach(field => {
          const value = this.getValue(field);
          if (value && this.isChanged(field, value, team))
            data[field] = value;
        });
      data['id'] = team.id;
    } else {
      ['name', 'tagline', 'description', 'admin_emails', 'parent_id', 'logo']
        .forEach(field => {
          const value = this.getValue(field);
          if (value)
            data[field] = value;
        });
      data['community_id'] = communityData.community.id;
      const adminEmails = data['admin_emails'];
      if (adminEmails) data['admin_emails'] = adminEmails + `, ${user.email}`;
      else data['admin_emails'] = user.email;
    }

    return data;
  }

  callAPI = async () => {
    const { team, onComplete, communityData, reduxLoadTeamsPage, reduxJoinTeam } = this.props;
    const data = this.getData();
    const url = team ? "teams.update" : "teams.create";

    try {
      this.setState({ loading: true });

      let teamResponse = await apiCall(url, data);
   
      if (teamResponse.success) {
        const newTeam = teamResponse.data;
        if (!team) reduxJoinTeam(newTeam);
        const teamsStatsResponse = await apiCall("teams.stats", { community_id: communityData.community.id });
        if (teamsStatsResponse.success) {
          reduxLoadTeamsPage(teamsStatsResponse.data);
        }
        onComplete(newTeam.id);
      } else {
        this.setState({ error: teamResponse.error });
      }
    } catch (err) {
      this.setState({ error: err.toString() });
    } finally {
      this.setState({ loading: false });
    }
  }
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
    teamsStats: store.page.teamsPage,
    communityData: store.page.homePage,
  };
};
const mapDispatchToProps = {
  reduxLoadTeamsPage,
  reduxJoinTeam
};

export default connect(mapStoreToProps, mapDispatchToProps)(TeamInfoModal);