export function getTeamData(teamsStats, thisTeamStats) {
  if (!teamsStats || !thisTeamStats) return [];

  const teamData = thisTeamStats;
  if (!thisTeamStats.team.parent) {
    teamData['subTeams'] = teamsStats
      .filter(otherTeamStats => otherTeamStats.team.parent &&
        otherTeamStats.team.parent.id === thisTeamStats.team.id)
  }
  return teamData;
}

export function getTeamsData(teamsStats) {
  if (!teamsStats) return [];

  const teamsData = [];
  teamsStats.forEach(thisTeamStats => {
    if (!thisTeamStats.team.parent) {
      const teamData = getTeamData(teamsStats, thisTeamStats);
      teamData['collapsed'] = true;
      teamsData.push(teamData);
    }
  });
  return teamsData;
}

export function inThisTeam(user, team) {
  if (!user || !user.teams || !team) return false;

  return user.teams.filter(_team =>
    _team.id === team.id
  ).length > 0;
}

export function inSubTeam(user, teamData) {
  if (!user || !user.teams || !teamData || !teamData.subTeams) return false;

  return user.teams.filter((team) =>
    teamData.subTeams.map(subTeamData => subTeamData.team.id).includes(team.id)
  ).length > 0;
}

export function inTeam(user, teamData) {
  if (!user || !teamData) return false;
  return inThisTeam(user, teamData.team) || inSubTeam(user, teamData);
};

