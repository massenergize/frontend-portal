import React from 'react';
import { connect } from "react-redux";
import {
    reduxJoinTeam,
    reduxLeaveTeam,
  } from "../../../redux/actions/userActions";
  import {
    reduxAddTeamMember,
    reduxRemoveTeamMember,
  } from "../../../redux/actions/pageActions";

class OneTeamPage extends React.Component {
    componentDidMount() {
        console.log("team page for ID: ", this.props.match.params.id);
    }
    render() {
        return null;
    }
}

const mapStoreToProps = store => {
    return {
        auth: store.firebase.auth,
        user: store.user.info,
        links: store.links
    };
};
const mapDispatchToProps = {
    reduxJoinTeam,
    reduxLeaveTeam,
    reduxAddTeamMember,
    reduxRemoveTeamMember,
  };
export default connect(mapStoreToProps, mapDispatchToProps)(OneTeamPage);
