const axios = require("axios");
const LEAGUE_ID = 271;
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getLeagueDetails() {
  const league = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  const stage = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/stages/${league.data.data.current_stage_id}`,
    {
      params: {
        api_token: process.env.api_token,
      },
    }
  );
  let games_id = await getMacthIdsBySeason();
 // let games_info = await getFutureGamesInfo(games_id);
  console.log(games_id);
  

  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    // next game details should come from DB
  };
}
// gather future games
async function getMacthIdsBySeason() {
  let games_ids_list = [];
  const games = await axios.get(
    `https://soccer.sportmonks.com/api/v2.0/seasons/17328`,
    {
      params: {
        api_token: process.env.api_token,
        include: "upcoming",
      },
    }
  );
  games.data.data.upcoming.data.map((game_id) =>
    games_ids_list.push(game_id.id)
  );
  return games_ids_list;
}
async function getFutureGamesInfo(futures_games_ids) {
  let promises = [];
  futures_games_ids.map((id) =>
    promises.push(
      axios.get(`${api_domain}/fixtures/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "localTeam,visitorTeam,season,stage",
        },
      })
    )
  );
  let future_games_info = await Promise.all(promises);
  return extractRelevantFutureGamesData(future_games_info);
}


exports.getLeagueDetails = getLeagueDetails;
