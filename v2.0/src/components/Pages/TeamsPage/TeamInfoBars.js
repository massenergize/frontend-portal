import React from "react";

class TeamInfoBars extends React.Component {

  render() {

    const teamStats = this.props.teamStats;

    const actions = teamStats.actions_completed;
    const carbonSaved = teamStats.carbon_footprint_reduction;

    let actionsPerMember, carbonSavedPerMember;
    const members = teamStats.members;

    if (members !== 0) {
      if (actions !== 0) {
        actionsPerMember = actions / members;
        actionsPerMember = (actionsPerMember % 1 !== 0) ?
          Number(actionsPerMember.toFixed(1)) : Number(actionsPerMember.toFixed(0));
      }
      if (carbonSaved !== 0) {
        carbonSavedPerMember = Number((carbonSaved / members).toFixed(0));
      }
    }

    return (
      <div className="team-card-content">
        <div className="info-section members">
          <p><b>{members.toLocaleString()}</b> member{(members !== 1) && 's'}</p>
        </div>
        <div className="info-section data">
          <p><b>{actions.toLocaleString()}</b> action{(actions !== 1) && 's'} completed
                {actionsPerMember && <span> (<b>{actionsPerMember.toLocaleString()}</b> per member)
              </span>
            }</p>
        </div>
        <div className="info-section data">
          <p> <b>{carbonSaved.toLocaleString()}</b> lb{(carbonSaved !== 1) && 's'}. carbon saved
          {carbonSavedPerMember && <span> (<b>{carbonSavedPerMember.toLocaleString()}</b> per member)
          </span>
            }</p>
        </div>
      </ div>
    );
  }
}

export default TeamInfoBars;
