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
import Error404 from "./../Errors/404";
import LoadingCircle from "../../Shared/LoadingCircle";
import { apiCall } from "../../../api/functions";
import BreadCrumbBar from "../../Shared/BreadCrumbBar";

class OneTeamPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      team: null,
      loading: true
    }
  }

  fetch(id) {
    apiCall('teams.info', { team_id: id }).then(json => {
      if (json.success) {
        this.setState({
          team: json.data,
          loading: false
        })
      }
    }).catch(err => {
      this.setState({ error: err.message, loading: false });
    })

  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.fetch(id);
  }

  render() {

    const team = this.state.team;

    if (this.state.loading) {
      return <LoadingCircle />;
    }
    if (!team) {
      return <Error404 />;
    }

    return (
      <>
        <div className="boxed_wrapper">
          <BreadCrumbBar
            links={[
              { link: this.props.links.teams, name: "Teams" },
              { name: `Team ${team ? team.id : "..."}` },
            ]}
          />
          <section className="shop-single-area" style={{ paddingTop: 0 }}>
            <div className="container">
              <div className="single-products-details">
                {this.renderTeam(team)}
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }
  renderTeam(team) {
    return <h1>{team.name}</h1>;
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
