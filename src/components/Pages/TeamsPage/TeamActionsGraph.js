import React from "react";
import { Bar } from "react-chartjs-2";
import { apiCall } from "../../../api/functions";
import { IS_PROD } from "../../../config/config";
import loader from "../../../assets/images/other/loader.gif";

class TeamActionsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      graphResponse: null,
    };
  }

  async fetch(id) {
    try {
      const json = await apiCall("graphs.actions.completed.byTeam", {
        team_id: id,
        is_dev: !IS_PROD,
      });
      if (json.success) {
        this.setState({ graphResponse: json.data });
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
    const { loading, graphResponse } = this.state;

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

    if (!graphResponse)
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

    graphResponse.data.forEach((el) => {
      if (el) {
        actions.labels.push(this.shortenWords(el.name));
        actions.datasets[0].data.push(el.value);
      }
    });

    return (
      <>
        <div style={{ height: "370px" }}>
          <Bar
            options={{
              plugins: { datalabels: false },
              maintainAspectRatio: false,
              scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{ stacked: true }],
              },
            }}
            data={actions}
          />
        </div>
      </>
    );
  }
}

export default TeamActionsGraph;
