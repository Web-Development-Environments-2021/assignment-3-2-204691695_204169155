const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

async function getPastGamesByTeam(team_id){
    return 0;
}

async function getFuturGamesIdByTeam(team_id){
    let upcomin_ids = []
    const team = await axios.get(`${api_domain}/teams/${team_id}`, {
        params: {
            include: "upcoming",
            api_token: process.env.api_token,
        },
    })
    team.data.data.upcoming.data.map((upcoming) =>
        upcomin_ids.push(upcoming.id)
    );
    return upcomin_ids;
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

  function extractRelevantFutureGamesData(future_games_info) {
    return future_games_info.map((game_info) => {
      console.log(game_info);

      const season = game_info.data.data.season.data.name;
      const stage = game_info.data.data.stage.data.name;
      const localTeam_name = game_info.data.data.localTeam.data.name;
      const visitorTeam_name = game_info.data.data.visitorTeam.data.name;
      const starting_date_time = game_info.data.data.time.starting_at.date_time;


      return {
        season: season,
        stage: stage,
        localTeam_name: localTeam_name,
        visitorTeam_name: visitorTeam_name,
        starting_date_time: starting_date_time,
      };
    });
  }
    
async function getFutureGames(team_id) {
    let futures_games_id_list = await getFuturGamesIdByTeam(team_id);
    console.log("getFuturGamesIdByTeam: "+ futures_games_id_list);
    let future_games_info = await getFutureGamesInfo(futures_games_id_list);
    return future_games_info;
  }

exports.getPastGamesByTeam = getPastGamesByTeam;
exports.getFutureGames = getFutureGames;