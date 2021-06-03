const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

/**
 * This function return team details given a teamName
 */
async function getTeamByName(team_name) {
  let teams = 
    await axios.get(`${api_domain}/teams/search/${team_name}`, {
      params: {
        api_token: process.env.api_token,
      },
    })
  return extractRelevantTeamDataByName(teams)
}

/**
 * This function extract only the relevant data of a team
 */
function extractRelevantTeamDataByName(teams) {
  return teams.data.data.map((team_info) => {
    const { id, name, logo_path } = team_info;
    if(team_info){
      return {
        team_id: id,
        name: name,
        logo: logo_path,
      }; 
    }  
  });
}

exports.getTeamByName = getTeamByName;