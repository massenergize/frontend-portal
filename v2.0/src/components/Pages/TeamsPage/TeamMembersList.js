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
      return <p>The members of this team could not be loaded.</p >;
    
    if (membersResponse.length === 0)
      return <p>There are no members of this team.</p>;

    const preferredNameMembers = membersResponse.filter(member => member.preferred_name);
    const numAnonymous = membersResponse.filter(member => !member.preferred_name).length;

    return (
      <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="show-scrollbar">
        <div className="boxed_wrapper">
          <div className="team-members-list">
            <ul>
              {preferredNameMembers.map(member =>
                <li key={member.id}>
                  {member.preferred_name}
                </li>
              )}
            </ul>
            {numAnonymous > 0 &&
              <p>
                {numAnonymous} user{numAnonymous !== 1 && 's'} would prefer to remain anonymous.
              </p>
            }
          </div>
        </div>
      </div >
    );
  }
}

export default TeamMembersList;