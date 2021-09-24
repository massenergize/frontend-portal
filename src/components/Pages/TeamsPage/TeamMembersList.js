import React from "react";
import { apiCall } from "../../../api/functions";
import loader from "../../../assets/images/other/loader.gif";

class TeamMembersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      membersResponse: null,
    };
  }

  async fetch(id) {
    const { onMembersLoad } = this.props;

    try {
      const json = await apiCall("teams.members.preferredNames", {
        team_id: id,
      });
      if (json.success) {
        this.setState({ membersResponse: json.data });
        onMembersLoad(json.data);
      } else {
        this.setState({ error: json.error });
      }
    } catch (err) {
      this.setState({ error: err.toString() });
    } finally {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    const id = this.props.teamID;
    this.fetch(id);
  }

  render() {
    const { loading, membersResponse } = this.state;

    if (loading)
      return (
        <img
          src={loader}
          alt="Loading..."
          style={{
            display: "block",
            margin: "auto",
            width: "150px",
            height: "150px",
          }}
        />
      );

    if (!membersResponse)
      return (
        <p className="error-p">The members of this team could not be loaded.</p>
      );

    if (membersResponse.length === 0)
      return <p>There are no members of this team.</p>;

    const [admins, layPeople] = membersResponse.reduce(
      ([pass, fail], member) => {
        return member.is_admin
          ? [[...pass, member], fail]
          : [pass, [...fail, member]];
      },
      [[], []]
    );

    return (
      <div
        style={{ maxHeight: "200px", overflowY: "auto" }}
        className="show-scrollbar"
      >
        <div className="boxed_wrapper">
          <div className="team-ul">
            <ul>
              {admins.map((admin) => (
                <li
                  key={admin.id}
                  style={{ marginLeft: 20, listStyleType: "circle" }}
                >
                  <b>
                    {admin.preferred_name}{" "}
                    <span style={{ color: "rgb(253 112 76)" }}>admin</span>
                  </b>
                </li>
              ))}
              {layPeople.map((layPerson) => (
                <li
                  key={layPerson.id}
                  style={{ marginLeft: 20, listStyleType: "circle" }}
                >
                  {layPerson.preferred_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default TeamMembersList;
