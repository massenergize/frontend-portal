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

class CompareTeamsPage extends React.Component {
    componentDidMount() {
        console.log("compare teams page");
    }
    render() {
        return null;
    }
}

const mapStoreToProps = store => {
    return {
        auth: store.firebase.auth,
        user: store.user.info,
        links: store.links,
        teamsPage: store.page.teamsPage,
    };
};

export default connect(mapStoreToProps)(CompareTeamsPage);
