const axios = require("axios");
const DButils = require("./DButils");
const LEAGUE_ID = 271; // Superliga
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getLeagueDetails() {
  // League name & Current season name
  const league = await axios.get(`${api_domain}/leagues/${LEAGUE_ID}`,{
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  
  // Current stage name
  const stage = await axios.get(`${api_domain}/stages/${league.data.data.current_stage_id}`,{
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  
  // Next game
  const currentDate = new Date();
  const timestamp = currentDate.getTime();   
  const future_games = await DButils.execQuery(`SELECT * FROM dbo.Games WHERE game_timestamp > '${timestamp}' `);
  
  future_games.sort(function(first, second) {
    return first.game_timestamp - second.game_timestamp;
  });
  
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    next_game: future_games[0] || "No future game in the league",
  };
}

exports.getLeagueDetails = getLeagueDetails;
