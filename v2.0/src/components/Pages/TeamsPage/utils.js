export function processTeamsStats(teamsStats) {
  const teamsData = [];
  teamsStats.forEach(thisTeamStats => {
    if (!thisTeamStats.team.parent) {
      const teamStatsWithSubTeams = thisTeamStats;
      teamStatsWithSubTeams['subTeams'] = teamsStats
        .filter(otherTeamStats => otherTeamStats.team.parent &&
          otherTeamStats.team.parent.id === thisTeamStats.team.id)
      teamStatsWithSubTeams['collapsed'] = true;
      teamsData.push(teamStatsWithSubTeams);
    }
  });
  return teamsData;
}

export function inThisTeam(user, teamData) {
  return user.teams.filter((team) =>
    team.id === teamData.team.id
  ).length > 0;
}

function inSubTeam(user, teamData) {
  if (!teamData.subTeams) return false;
  return user.teams.filter((team) =>
    teamData.subTeams.map(subTeamData => subTeamData.team.id).includes(team.id)
  ).length > 0;
}

export function inTeam(user, teamData) {
  if (!user || !teamData) return false;
  return inThisTeam(user, teamData) || inSubTeam(user, teamData);
};

