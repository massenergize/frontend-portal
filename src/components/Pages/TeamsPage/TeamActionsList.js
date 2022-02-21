import React from "react";
import { apiCall } from "../../../api/functions";
import loader from "../../../assets/images/other/loader.gif";
import DataTable from "react-data-table-component";
import { smartString } from "../../Utils";

class TeamActionsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      listResponse: null,
    };
  }

  async fetch(id) {
    try {
      const json = await apiCall("teams.actions.completed", {
        team_id: id,
      });
      if (json.success) {
        this.setState({ listResponse: json.data });
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

  //shortenWords(word) {
  //  let stringArr = word.split(" ");
  //  if (word.toLowerCase() === "home energy") return word;
  //  return stringArr[0];
  //}

  render() {
    const { loading, listResponse } = this.state;
    const { history, links } = this.props;
    const columns = [
      {
        name: "Action Name",
        selector: (row) => row.name,
        sortable: true,
        width: 40,
        cell: ({ name, id }) => (
          <span
            className="touchable-opacity me-team-table-cell"
            onClick={() => history?.push(links?.actions + "/" + id)}
          >
            {smartString(name, 40)}
          </span>
        ),
      },
      {
        name: "Category",
        selector: (row) => row.category,
        sortable: true,
        width: 20,
      },
      {
        name: "# Done",
        selector: (row) => row.done_count,
        sortable: true,
        center: true,
        width: 6,
      },
      {
        name: "Carbon savings",
        selector: (row) => row.carbon_total,
        sortable: true,
        center: true,
        width: 12,
      },
      {
        name: "# Todo",
        selector: (row) => row.todo_count,
        sortable: true,
        center: true,
        width: 6,
      },
    ];

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

    if (!listResponse)
      return (
        <p className="error-p">
          The actions data for this team could not be loaded.
        </p>
      );

    return (
      <div>
        <DataTable columns={columns} data={listResponse} dense />
      </div>
    );
  }
}

export default TeamActionsList;
