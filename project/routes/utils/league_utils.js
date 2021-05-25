const axios = require("axios");
const DButils = require("./DButils");
const user_utils = require("./users_utils");
const games_utils = require("./games_utils");
const LEAGUE_ID = 271; // Superliga
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getLeagueDetails(user_id) {
  let league_details = {};
  league_details["left_column"] = await left_details();
  if(user_id != "")
    league_details["right_column"] = await right_details(user_id);
  return league_details;
}

async function left_details() {
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

async function right_details(user_id) {
  const games_ids = await user_utils.getFavoriteGames(user_id);
  let games_ids_array = [];
  games_ids.map((element) => games_ids_array.push(element.game_id)); //extracting the players ids into array
  const fav_games = await games_utils.getGamesInfo(games_ids_array);
  const top3favGame = fav_games.filter((name,idx) => idx<3);
  return top3favGame;
}

exports.getLeagueDetails = getLeagueDetails;
