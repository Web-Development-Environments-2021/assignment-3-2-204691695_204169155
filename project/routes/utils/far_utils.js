const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const DButils = require("./DButils");
const LEAGUE_ID = 271; // Superliga
const SEASON_ID = 17328; // 2020-2021

/**
 * This function return the all the league teams
 */
async function getLeagueTeams(){
    const season = await axios.get(`${api_domain}/seasons/${SEASON_ID}`, {
        params: {
            include: "fixtures",
            api_token: process.env.api_token,
        },
    });

    const teams_set = new Set();
    season.data.data.fixtures.data.forEach(season_data => {
        teams_set.add(season_data.localteam_id);
        teams_set.add(season_data.visitorteam_id);
    });
    return getTeamInfo(teams_set);
}

/**
 * This function return teams info by getting a teams_ids list
 */
async function getTeamInfo(teams_ids_list) {
    let promises = [];
    teams_ids_list.forEach((id) =>{
        promises.push(
            axios.get(`${api_domain}/teams/${id}`, {
            params: {
                api_token: process.env.api_token,
            },
            })
        )
    }
    );
    let teams_info = await Promise.all(promises);
    return teams_info;
}

/**
 * This function extract and return relevant team data by given a teams info
 */
function extractRelevantTeamData(teams_info) {
    return teams_info.map((team_info) => {
      const { id, name} = team_info.data.data;
      return {
        team_id: id,
        team_name: name,
      };
    });
}

/**
 * This function return the FAR page details (games, teams, stadiums)
 */
async function getFarPageDetails() {
    let league_games = await DButils.execQuery(`SELECT * FROM dbo.Games`);
    let teams_info = await getLeagueTeams();
    let league_teams = await extractRelevantTeamData(teams_info);
    let stadiums = await DButils.execQuery(`SELECT stadium_id,name,city FROM dbo.Stadiums`);
    const far_info = {games: league_games, teams: league_teams, stadiums: stadiums};
    return far_info;
}

exports.getFarPageDetails = getFarPageDetails;