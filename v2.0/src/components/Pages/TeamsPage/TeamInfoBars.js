import React from "react";
import { addCommasToNumber } from "../../Utils"

class TeamInfoBars extends React.Component {

  render() {

    const teamStats = this.props.teamStats;

    const actions = teamStats.actions_completed;
    const carbonSaved = teamStats.carbon_footprint_reduction;

    let actionsPerMember, carbonSavedPerMember;
    const members = teamStats.members;

    if (members !== 0) {
      actionsPerMember = actions / members;
      actionsPerMember = (actionsPerMember % 1 !== 0) ?
        actionsPerMember.toFixed(1) : actionsPerMember.toFixed(0);
      carbonSavedPerMember = (carbonSaved / members).toFixed(0);
    }

    return (
      <div className="team-card-content">
        <div className="info-section members">
          <p><b>{addCommasToNumber(members)}</b> member{(members !== 1) && 's'}</p>
        </div>
        <div className="info-section data">
          <p><b>{addCommasToNumber(actions)}</b> action{(actions !== 1) && 's'} completed
                {actionsPerMember && <span> (<b>{addCommasToNumber(actionsPerMember)}</b> per member)
              </span>
            }</p>
        </div>
        <div className="info-section data">
          <p> <b>{addCommasToNumber(carbonSaved)}</b> lb{(carbonSaved !== 1) && 's'}. carbon saved
          {carbonSavedPerMember && <span> (<b>{addCommasToNumber(carbonSavedPerMember)}</b> per member)
          </span>
            }</p>
        </div>
      </ div>
    );
  }
}

export default TeamInfoBars;