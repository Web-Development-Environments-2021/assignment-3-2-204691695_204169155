const axios = require("axios");
const DButils = require("./DButils");
const LEAGUE_ID = 271; // Superliga
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
  UpdateFutureGamesInfo(games_id);
  // get latest game
  const future_games = await DButils.execQuery(`SELECT * FROM dbo.FutureGames`);
  future_games.sort(function(first, second) {
    return first.game_timestamp - second.game_timestamp;
  });
  

  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    next_game: future_games[0],
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
async function UpdateFutureGamesInfo(futures_games_ids) {
  let promises = [];
  futures_games_ids.map((id) =>
    promises.push(
      axios.get(`${api_domain}/fixtures/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "localTeam,visitorTeam",
        },
      })
    )
  );
  let future_games_info = await Promise.all(promises);
  future_games_info.forEach(element => {
    const game_id = element.data.data.id;
    const stage_id = element.data.data.stage_id;
    const round_id = element.data.data.round_id;
    const hometeam_id = element.data.data.localteam_id;
    const hometeam_name = element.data.data.localTeam.data.name
    const hometeam_logo = element.data.data.localTeam.data.logo_path
    const vistorteam_id = element.data.data.visitorteam_id;
    const vistorteam_name = element.data.data.visitorTeam.data.name
    const vistorteam_logo = element.data.data.visitorTeam.data.logo_path
    const game_date = element.data.data.time.starting_at.date_time;
    const game_timestamp = element.data.data.time.starting_at.timestamp;
    DButils.execQuery(
      `IF EXISTS(SELECT * from dbo.FutureGames where game_id='${game_id}')
        UPDATE dbo.FutureGames SET game_date='${game_date}',game_timestamp='${game_timestamp}' WHERE game_id='${game_id}'
      ELSE
        INSERT INTO dbo.FutureGames 
        (game_id, stage_id, round_id, 
        homeTeam_id, homeTeam_name, homeTeam_logo,
        visitorTeam_id, visitorTeam_name, visitorTeam_logo,
        game_date,game_timestamp)
        VALUES ('${game_id}','${stage_id}','${round_id}',
        '${hometeam_id}','${hometeam_name}','${hometeam_logo}',
        '${vistorteam_id}','${vistorteam_name}','${vistorteam_logo}',
        '${game_date}','${game_timestamp}')`
      );
  });
  return 1;
}


exports.getLeagueDetails = getLeagueDetails;
