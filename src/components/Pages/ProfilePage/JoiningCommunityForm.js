import React from "react";
import { apiCall } from "../../../api/functions";
import { connect } from "react-redux";
import { reduxLoadUserCommunities } from "../../../redux/actions/userActions";
import MEButton from "../Widgets/MEButton";
import MECard from "../Widgets/MECard";
import METextView from "../Widgets/METextView";
import { getPropsArrayFromJsonArray } from "../../Utils";
import MEDropdown from "../Widgets/MEDropdown";

class JoiningCommunityForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "--",
    };

    this.onChange = this.onChange.bind(this);
  }

  getAllCommunities() {
    const userComms = this.props.user.communities;
    console.log("I AM THE COMMUNITIES BRUH", this.props.communities);
    const commArr = [];
    if (!this.props.communities) return { names: [], ids: [] };
    Object.keys(this.props.communities).map((key) => {
      const com = this.props.communities[key];
      if (userComms) {
        var alreadInCommunity = userComms.filter(
          (community) => community.id === com.id
        );
        if (alreadInCommunity.length !== 0) return null; // dont show the communities a user is already a part of
      }
      commArr.push(com);
      return null;
    });
    var commNames = getPropsArrayFromJsonArray(commArr, "name");
    var ids = getPropsArrayFromJsonArray(commArr, "id");
    return { names: commNames, ids };
  }
  render() {
    const { names, ids } = this.getAllCommunities();
    return (
      <MECard className="me-anime-open-in">
        <METextView> Community </METextView>
        &nbsp;
        <MEDropdown
          data={names}
          dataValues={ids}
          value={names[ids.indexOf(this.state.value)]}
          onItemSelected={this.onChange}
        ></MEDropdown>
        <br />
        <MEButton onClick={this.onSubmit}>Join</MEButton>
        <MEButton variation="accent" onClick={this.props.closeForm}>
          Cancel
        </MEButton>
      </MECard>
    );
  }

  //updates the state when form elements are changed
  onChange(item) {
    this.setState({
      value: item,
    });
  }

  onSubmit = () => {
    if (this.state.value !== "--") {
      const body = {
        user_id: this.props.user.id,
        community_id: this.state.value,
      };

      /** Collects the form data and sends it to the backend */
      apiCall("communities.join", body)
        .then((json) => {
          if (json.success) {
            this.props.reduxLoadUserCommunities(json.data.communities);
            this.props.closeForm();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
}

const mapStoreToProps = (store) => {
  return {
    communities: store.page.communities,
    user: store.user.info,
  };
};
const mapDispatchToProps = { reduxLoadUserCommunities };
//composes the login form by using higher order components to make it have routing and firebase capabilities
export default connect(
  mapStoreToProps,
  mapDispatchToProps
)(JoiningCommunityForm);
