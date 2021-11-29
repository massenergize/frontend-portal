import React from "react";
import { Bar } from "react-chartjs-2";
import { apiCall } from "../../../api/functions";
import { IS_PROD } from "../../../config/config";
import loader from "../../../assets/images/other/loader.gif";
import DataTable from 'react-data-table-component';

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
      const json = await apiCall("graphs.actions.completed.byTeam", {
        team_id: id,
        is_dev: !IS_PROD,
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

  shortenWords(word) {
    let stringArr = word.split(" ");
    if (word.toLowerCase() === "home energy") return word;
    return stringArr[0];
  }

  render() {
    const { loading, listResponse } = this.state;

    const columns = [
      {
          name: 'Action name',
          selector: row => row.action,
          sortable: true,
      },
      {
        name: 'Category',
        selector: row => row.category,
        sortable: true,
      },
      {
        name: '# Done',
        selector: row => row.done,
        sortable: true,
      },
      {
        name: 'Carbon savings',
        selector: row => row.carbon,
        sortable: true,
      },
      {
        name: '# Todo',
        selector: row => row.todo,
        sortable: true,
      },
    ];
  
    const data = [
      {
          id: 1,
          action: 'Install a heat pump',
          category: 'Home Energy',
          done: 20,
          carbon: 40000,
          todo: 2,
      },
      {
        id: 2,
        action: 'Install a solar array',
        category: 'Solar',
        done: 10,
        carbon: 30000,
        todo: 4,
      },
      {
        id: 3,
        action: 'Buy an electric vehicle',
        category: 'Transportation',
        done: 5,
        carbon: 10000,
        todo: 5,
      },
    ]
  
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

    let actions = {
      labels: [],
      datasets: [
        {
          label: "Actions",
          data: [],
          backgroundColor: "rgba(251, 85, 33, 0.85)",
        },
      ],
    };

    return (
      <div>
      This will be a list of actions (linked to action page), category, # done, carbon, # todo
      <DataTable
            columns={columns}
            data={data}
        />
      </div>
    )
  }
}

export default TeamActionsList;
