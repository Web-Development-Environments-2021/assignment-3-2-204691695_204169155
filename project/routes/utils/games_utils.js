const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

// ---------------- Future Games----------------------------
async function getAllFutureGames(){
  // Next games
  const currentDate = new Date();
  const timestamp = currentDate.getTime();   
  const future_games = await DButils.execQuery(
    `SELECT * FROM dbo.Games WHERE game_timestamp >= '${timestamp}' `
  );
  future_games.sort(function(first, second) {
    return first.game_timestamp - second.game_timestamp;
  });
  return future_games
}

async function getFutureGamesByTeam(team_id){
  // Next games
  const currentDate = new Date();
  const timestamp = currentDate.getTime();   
  const future_games = await DButils.execQuery(
    `SELECT * FROM dbo.Games WHERE (homeTeam_id = '${team_id}' OR visitorTeam_id = '${team_id}') AND game_timestamp >= '${timestamp}' `
  );
  future_games.sort(function(first, second) {
    return first.game_timestamp - second.game_timestamp;
  });
  return future_games
}

async function getFutureGames(team_id) {
  let future_games_info = await getFutureGamesByTeam(team_id);
  return future_games_info;
}

// ---------------- Past Games----------------------------
async function getAllPastGames(){
  // Next games
  const currentDate = new Date();
  const timestamp = currentDate.getTime();   
  const past_games = await DButils.execQuery(
    `SELECT * FROM dbo.Games WHERE game_timestamp < '${timestamp}' `
  );
  past_games.sort(function(first, second) {
    return first.game_timestamp - second.game_timestamp;
  });
  return past_games
}

async function getPastGamesByTeam(team_id){
  // Next game
  const currentDate = new Date();
  const timestamp = currentDate.getTime();   
  const past_games = await DButils.execQuery(
    `SELECT * FROM dbo.Games WHERE (homeTeam_id = '${team_id}' OR visitorTeam_id = '${team_id}') AND game_timestamp < '${timestamp}' `
  );
  past_games.sort(function(first, second) {
    return first.game_timestamp - second.game_timestamp;
  });
  return past_games
}

async function getPastGames(team_id) {
  let past_games_info = await getPastGamesByTeam(team_id);
  return past_games_info;
}

// ---------------- Insert Games----------------------------
async function checkAndInsertGame(homeTeam, visitorTeam, date, hour, referee, stadium){
  const same_date_games = await DButils.execQuery(
    `SELECT * FROM dbo.Games WHERE game_date='${date}' and game_hour='${hour}'`
  );
  
  // check validation of the insert game (stadium empty and teams available)
  var BreakException = {};
  try{
    same_date_games.forEach(game => {
      console.log("in");
      if(game.stadium == stadium)
        throw {
          status: 401,
          message: "Stadium is occupied",
        }
      if(game.homeTeam_id == homeTeam || game.homeTeam_id == visitorTeam)
        throw {
          status: 401,
          message: "One or more of the teams is already playing at this hour",
        }
      if (game.visitorTeam_id == homeTeam || game.visitorTeam_id == visitorTeam)
        throw {
          status: 401,
          message: "One or more of the teams is already playing at this hour",
        }
      if (game.referee == referee)
        throw {
          status: 401,
          message: "Referee is occupied",
        }
    });
    const time_stamp = new Date(date+"T"+hour).getTime();
    const db_a = await DButils.execQuery(
      `INSERT INTO dbo.Games (homeTeam_id, visitorTeam_id, game_date, game_hour, game_timestamp, referee, stadium) 
        VALUES ('${homeTeam}', '${visitorTeam}', '${date}', '${hour}', '${time_stamp}' ,'${referee}', '${stadium}')`
    );
    return true;
  }
  catch(e){
    throw e;
  }

}

async function getGamesInfo(games_ids_array) {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();   

  favorite_game_info = [];
  await Promise.all(games_ids_array.map( async (id) => {
    const game = await DButils.execQuery(
      `SELECT * FROM dbo.Games WHERE game_id = '${id}' `
    )
    if (game[0].game_timestamp < timestamp){
      console.log("in") ;
       await DButils.execQuery(`DELETE FROM dbo.FavoriteGames WHERE game_id = '${id}' `)
    }
    else
      favorite_game_info.push(game[0]);

  }));
  return favorite_game_info;
}

exports.getPastGames = getPastGames;
exports.getFutureGames = getFutureGames;
exports.getAllFutureGames = getAllFutureGames;
exports.getAllPastGames = getAllPastGames;
exports.checkAndInsertGame = checkAndInsertGame;
exports.getGamesInfo = getGamesInfo;