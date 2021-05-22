const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

// Get Team by Name
async function getTeamByName(team_name) {
  let teams = 
    await axios.get(`${api_domain}/teams/search/${team_name}`, {
      params: {
        api_token: process.env.api_token,
      },
    })
  return extractRelevantTeamDataByName(teams)
}

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