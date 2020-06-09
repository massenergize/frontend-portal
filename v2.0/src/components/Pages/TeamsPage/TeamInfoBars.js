import React from "react";
import { addCommasToNumber } from "../../Utils"

class TeamInfoBars extends React.Component {

  render() {

    const teamStats = this.props.teamStats;

    const actions = teamStats.actions_completed;
    const carbonSaved = teamStats.carbon_footprint_reduction;

    let actionsPerHousehold, carbonSavedPerHousehold;
    const households = teamStats.members;

    if (households !== 0) {
      actionsPerHousehold = (actions / households).toFixed(1);
      carbonSavedPerHousehold = (carbonSaved / households).toFixed(1);
    } else {
      actionsPerHousehold = carbonSavedPerHousehold = "0.0";
    }

    return (
      <div className="team-card-content">
        <div className="info-section household">
          <p><b>{addCommasToNumber(households)}</b> household{(households !== 1) && 's'}</p>
        </div>
        <div className="info-section data">
          <p><b>{addCommasToNumber(actions)}</b> actions completed (<b>{addCommasToNumber(actionsPerHousehold)}</b> per household)</p>
        </div>
        <div className="info-section data">
          <p> <b>{addCommasToNumber(carbonSaved)}</b> lbs. carbon saved (<b>{addCommasToNumber(carbonSavedPerHousehold)}</b> per household)</p>
        </div>
      </ div>
    );
  }
}

export default TeamInfoBars;