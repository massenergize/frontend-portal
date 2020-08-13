//create a list of parent teamStats whose children field contain all of their child teams
//and also contain a "collapsed" flag for the all teams page
export function processTeamsStats(teamsStats) {
  const teamsData = [];
  teamsStats.forEach(thisTeamStats => {
    if (!thisTeamStats.team.parent) {
      const teamStatsWithChildren = thisTeamStats;
      teamStatsWithChildren['children'] = teamsStats
        .filter(otherTeamStats => otherTeamStats.team.parent &&
          otherTeamStats.team.parent.id === thisTeamStats.team.id)
      teamStatsWithChildren['collapsed'] = true;
      teamsData.push(teamStatsWithChildren);
    }
  });
  return teamsData
}

export function inThisTeam(user, teamData) {
  return user.teams.filter((team) =>
    team.id === teamData.team.id
  ).length > 0;
}

function inChildTeam(user, teamData) {
  if (!teamData.children) return false;
  return user.teams.filter((team) =>
    teamData.children.map(childStats => childStats.team.id).includes(team.id)
  ).length > 0;
}

export function inTeam(user, teamData) {
  if (!user || !teamData) return false;
  return inThisTeam(user, teamData) || inChildTeam(user, teamData);
};

