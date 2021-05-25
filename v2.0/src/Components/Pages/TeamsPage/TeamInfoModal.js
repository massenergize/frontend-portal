import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { reduxLoadTeams } from "../../../redux/actions/pageActions";
import { reduxJoinTeam } from "../../../redux/actions/userActions";
// import loader from "../../../assets/images/other/loader.gif";
import MEModal from "../Widgets/MEModal";
import MEFormGenerator, {
  BAD,
  GOOD,
} from "../Widgets/FormGenerator/MEFormGenerator";
import { getPropsArrayFromJsonArray } from "../../Utils";

class TeamInfoModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      notification: null,
    };

    this.submitForm = this.submitForm.bind(this);
  }

  getNeededFields() {
    const { team, user } = this.props;
    const parentOptions = this.getParentTeamOptions();
    const pTeamNames = getPropsArrayFromJsonArray(parentOptions, "name");
    const pTeamIds = getPropsArrayFromJsonArray(parentOptions, "id");
    const parentFields = parentOptions
      ? [
          {
            type: "section-creator",
            title: "Parent Team",
            text:
              "You can pick a parent team to which all of your members' actions will also automatically contribute",
          },
          {
            required: false,
            name: "parent_id",
            type: "dropdown",
            data: pTeamNames,
            dataValues: pTeamIds,
            placeholder:
              "Choose which team is the parent team",
            value: team && team.parent ? team.parent.name : "NONE",
            defaultKey: "NONE",
          },
        ]
      : [];

    return [
      {
        hasLabel: true,
        required: true,
        name: "name",
        type: "input",
        label: "Name*",
        placeholder: "What your team will be known by...",
        value: team && team.name,
      },
      {
        hasLabel: true,
        required: true,
        name: "tagline",
        type: "input",
        label: "Tagline*",
        placeholder: "A catchy slogan for your team...",
        value: team && team.tagline,
      },
      !team && {
        hasLabel: true,
        name: "admin_emails",
        type: "chips",
        label: "Add team admins here with their emails",
        placeholder: "Enter an admin email and click <Add>...",
        asArray: true,
        separationKey: ",",
        value: [user && user.email],
      },
      {
        hasLabel: true,
        required: true,
        name: "description",
        type: "textarea",
        label: "Description*",
        placeholder:
          "Describe your team. Who are you and what brings you together?...",
        value: team && team.description,
      },
      {
        hasLabel: true,
        name: "logo",
        type: "file",
        label: "Select a logo for your team",
        defaultValue: team && team.logo && team.logo.url,
        showOverlay: false,
        maxWidth: 800, // maximum width of crop frame
        maxHeight: 800, // maximum height of crop frame
        ratioHeight:3, 
        ratioWidth:4,
      },
      ...parentFields,
    ];
  }

  getParentTeamOptions() {
    const { team, teamsStats } = this.props;
    const teams = teamsStats.map((teamStats) => teamStats.team);
    const parentTeamOptions =
      (!team ||
        teams.filter((_team) => _team.parent && _team.parent.id === team.id)
          .length === 0) &&
      teams.filter((_team) => (!team || _team.id !== team.id) && !_team.parent);

    return parentTeamOptions;
  }

  render() {
    const { team, onClose, user } = this.props;
    const { notification } = this.state;
    //if other teams have us as a parent, can't set a parent ourselves
    //from that point, can set parent teams that are not ourselves AND don't have parents themselves (i.e. aren't sub-teams)
    // const teams = teamsStats.map((teamStats) => teamStats.team);
    // const parentTeamOptions = this.getParentTeamOptions();

    let form;
    if (user) {
      form = (
        <MEFormGenerator
          style={{
            maxHeight: "120vh",
            overflowY: "scroll",
            paddingTop: 0,
            marginTop: 0,
          }}
          fields={this.getNeededFields()}
          elevate={false}
          animate={false}
          actionText={team ? "Update" : "Create"}
          onSubmit={this.submitForm}
          info={notification}
        />
      );
    } else {
      //the "edit team" button won't render if user isn't signed in, so can just mention creating a team
      form = (
        <p>
          You must{" "}
          <Link to={this.props.links.signin}>Sign In or Create a Profile</Link>{" "}
          to start a team.
        </p>
      );
    }

    return (
      <>
        <MEModal
          size="lg"
          closeModal={() => onClose()}
          contentStyle={{ width: "98%", padding: 0, top: 10, height: "100vh", margin:15 }}
          style={{ height: "100vh" }}
        >
          <h4 style={{ paddingRight: "60px", marginBottom: 0 }}>
            {team ? (
              <span>
                Edit <b>{team.name}</b>
              </span>
            ) : ( 
              "Create Team"
            )}
          </h4>
          <div style={{ overflowY: "auto", maxHeight: "90%" }}>
            <div>{form}</div>
          </div>
        </MEModal>
      </>
    );
  }

  getValue = (field) => {
    const input = document.getElementById(`team-${field}`);
    if (!input) return null;
    if (field === "logo") {
      return input.files[0];
    }
    return input.value;
  };

  isChanged = (field, value, team) => {
    if (["name", "tagline", "description"].includes(field))
      return value !== team[field];
    if (field === "parent_id")
      return (!team.parent && value) || team.parent.id !== value;
    if (field === "logo" && value)
      //if any image is uploaded, it's new
      return true;
  };

  getData = () => {
    const { team, communityData, user } = this.props;
    const data = {};
    if (team) {
      ["name", "tagline", "description", "parent_id", "logo"].forEach(
        (field) => {
          const value = this.getValue(field);
          if (value && this.isChanged(field, value, team)) data[field] = value;
        }
      );
      data["id"] = team.id;
    } else {
      // this is all you need, remember to look here....
      [
        "name",
        "tagline",
        "description",
        "admin_emails",
        "parent_id",
        "logo",
      ].forEach((field) => {
        const value = this.getValue(field);

        if (value) data[field] = value;
      });
      data["community_id"] = communityData.community.id;
      const adminEmails = data["admin_emails"];
      if (adminEmails) data["admin_emails"] = adminEmails + `, ${user.email}`;
      else data["admin_emails"] = user.email;
    }

    return data;
  };

  submitForm(e, data, resetForm) {
    const { team } = this.props;
    e.preventDefault();


    if (!data || data.isNotComplete) return;

    // stay in the same is_published state
    if (team) {
      data = { ...data, is_published: team.is_published };
    }

    this.setState({
      notification: {
        icon: "fa fa-spinner fa-spin",
        type: GOOD,
        text: team ? "Updating..." : "Starting to initialize team...",
      },
    });
    this.callAPI(data, resetForm);
  }
  callAPI = async (data, resetForm) => {
    const {
      team,
      onComplete,
      communityData,
      reduxLoadTeams,
      reduxJoinTeam,
    } = this.props;
    var url;
    if (team) {
      url = "teams.update";
      data = { ...data, id: team.id };
    } else {
      url = "teams.create";
    }
    data = { ...data, community_id: communityData.community.id };
    try {
      // this.setState({ loading: true });
      const teamResponse = await apiCall(url, data);    
      if (teamResponse.success) {
        this.setState({
          notification: {
            icon: "fa fa-check",
            type: GOOD,
            text: "Team has been initialized, it is now pending approval.",
          },
        });
        resetForm();
        const newTeam = teamResponse.data;
        if (!team) reduxJoinTeam(newTeam);
        const teamsStatsResponse = await apiCall("teams.stats", {
          community_id: communityData.community.id,
        });
        if (teamsStatsResponse.success) {
          reduxLoadTeams(teamsStatsResponse.data);
        }
        onComplete(newTeam.id);
      } else {
        this.setError(teamResponse.error);
      }
    } catch (err) {
      // this.setState({ error: err.toString() });
      this.setError(err.toString());
    } finally {
      this.setState({ loading: false });
    }
  };

  setError(message) {
    this.setState({
      notification: { icon: "fa fa-times", type: BAD, text: message },
    });
  }
}

const mapStoreToProps = (store) => {
  return {
    user: store.user.info,
    links: store.links,
    teamsStats: store.page.teams,
    communityData: store.page.homePage,
  };
};
const mapDispatchToProps = {
  reduxLoadTeams,
  reduxJoinTeam,
};

export default connect(mapStoreToProps, mapDispatchToProps)(TeamInfoModal);
