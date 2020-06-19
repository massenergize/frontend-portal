import React from 'react';
import { Bar } from "react-chartjs-2";
import { apiCall } from "../../../api/functions";

class TeamActionsGraph extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      graphResponse: null
    }
  }

  fetch(id) {
    apiCall('graphs.actions.completed.byTeam', { team_id: id }).then(json => {
      if (json.success)
        this.setState({ graphResponse: json.data, loading: false });
    }).catch(err => {
      this.setState({ error: err.message, loading: false });
    }).finally(() => this.setState({ loading: false }));
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
      return <img src={require('../../../assets/images/other/loader.gif')} alt="Loading..." style={{ display: 'block', margin: 'auto', width: "150px", height: "150px" }} />

    if (!graphResponse)
      return <p>The actions data for this team could not be loaded.</p >;

    let actions = {
      labels: [],
      datasets: [
        {
          label: 'Actions',
          data: [],
          backgroundColor: "rgba(251, 85, 33, 0.85)",
        }
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
        <div style={{ height: '300px' }}>
          <Bar
            options={{
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
    )
  }

}

export default TeamActionsGraph;
