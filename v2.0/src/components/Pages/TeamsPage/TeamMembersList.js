import React from 'react';
import { apiCall } from "../../../api/functions";

class TeamMembersList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      membersResponse: null
    }
  }

  fetch(id) {
    apiCall('teams.members.preferredNames', { team_id: id }).then(json => {
      if (json.success)
        this.setState({ membersResponse: json.data, loading: false });
    }).catch(err => {
      this.setState({ error: err.message, loading: false });
    }).finally(() => this.setState({ loading: false }));
  }

  componentDidMount() {
    const id = this.props.teamID;
    this.fetch(id);
  }

  render() {
    const { loading, membersResponse } = this.state;

    if (loading)
      return <img src={require('../../../assets/images/other/loader.gif')} alt="Loading..." style={{ display: 'block', margin: 'auto', width: "150px", height: "150px" }} />

    if (!membersResponse)
      return <p className="error-p">The members of this team could not be loaded.</p >;

    if (membersResponse.length === 0)
      return <p>There are no members of this team.</p>;

    const [admins, layPeople] = membersResponse.reduce(([pass, fail], member) => {
      return member.is_admin ? [[...pass, member], fail] : [pass, [...fail, member]];
    }, [[], []]);

    return (
      <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="show-scrollbar">
        <div className="boxed_wrapper">
          <div className="team-members-list">
            <ul>
              {admins.map(admin =>
                <li key={admin.id}>
                  <b>{admin.preferred_name}</b> <i>(admin)</i>
                </li>
              )}
              {layPeople.map(layPerson =>
                <li key={layPerson.id}>
                  {layPerson.preferred_name}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div >
    );
  }
}

export default TeamMembersList;
