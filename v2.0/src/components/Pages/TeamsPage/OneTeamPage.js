import React from 'react';
import { connect } from "react-redux";

class OneTeamPage extends React.Component {
    componentDidMount() {
        console.log("team with ID: ", this.props.match.params.id)
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
export default connect(mapStoreToProps)(OneTeamPage);
