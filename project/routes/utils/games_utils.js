const axios = require("axios");
const { compare } = require("bcryptjs");
const DButils = require("./DButils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

// ----------------------------- Future Games --------------------------------
/**
 * This function return All future games
 */
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

/**
 * This function return the future games by given team id
 */
async function getFutureGamesByTeam(team_id){
  const currentDate = new Date();
  const timestamp = currentDate.getTime();   
  const future_games = await DButils.execQuery(
    `SELECT * FROM dbo.Games WHERE (homeTeam_id = '${team_id}' OR visitorTeam_id = '${team_id}') AND game_timestamp >= '${timestamp}' `
  );

  // sorting the games by date (increasing)
  future_games.sort(function(first, second) {
    return first.game_timestamp - second.game_timestamp;
  });
  return future_games
}

/**
 * This function return the future games by given team id
 */
async function getFutureGames(team_id) {
  let future_games_info = await getFutureGamesByTeam(team_id);
  return future_games_info;
}


// ----------------------------- Past Games --------------------------------
/**
 * This function get all the past games
 */
async function getAllPastGames(){
  let data ={games:"",eventLogs:""};
  const currentDate = new Date();
  const timestamp = currentDate.getTime();   
  const past_games = await DButils.execQuery(
    `SELECT * FROM dbo.Games WHERE game_timestamp < '${timestamp}' `
  );
  past_games.sort(function(first, second) {
    return first.game_timestamp - second.game_timestamp;
  });
  let logs = [];
  past_games.forEach(async (g)=> {
    const log = await getEventLog(g.game_id);
    if(log.length>0){
      logs.push(log);
    }
  })
  data.games = past_games;
  data.eventLogs = logs;
  return data;
}

/**
 * This function get the past games by team_id
 */
async function getPastGamesByTeam(team_id){
  const currentDate = new Date();
  const timestamp = currentDate.getTime();   
  const past_games = await DButils.execQuery(
    `SELECT * FROM dbo.Games WHERE (homeTeam_id = '${team_id}' OR visitorTeam_id = '${team_id}') AND game_timestamp < '${timestamp}' `
  );

  // sorting the game by date (increasing)
  past_games.sort(function(first, second) {
    return first.game_timestamp - second.game_timestamp;
  });
  return past_games
}

/**
 * This function get the past games by team_id
 */
async function getPastGames(team_id) {
  let past_games_info = await getPastGamesByTeam(team_id);
  return past_games_info;
}

// ----------------------------- Insert Game --------------------------------
/**
 * This function try to insert a new game to the system (validate parameters and availabilty first).
 */
async function checkAndInsertGame(homeTeam, visitorTeam, date, hour, referee, stadium){
  const same_date_games = await DButils.execQuery(
    `SELECT * FROM dbo.Games WHERE game_date='${date}' and game_hour='${hour}'`
  );
  
  try{
    // check validation of the insert game (stadium empty and teams available)
    same_date_games.forEach(game => {
      if(game.stadium == stadium)
        throw {
          status: 401,
          message: "Stadium is occupied",
        }
      if(game.homeTeam_id == homeTeam || game.homeTeam_id == visitorTeam || game.visitorTeam_id == homeTeam || game.visitorTeam_id == visitorTeam)
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

    // Inserting the game
    console.log()
    const time_stamp = new Date(date+"T"+hour).getTime();
    const db_a = await DButils.execQuery(
      `INSERT INTO dbo.Games (homeTeam_id, visitorTeam_id, game_date, game_hour, game_timestamp, referee, stadium) 
        VALUES (${homeTeam}, ${visitorTeam}, '${date}', '${hour}', '${time_stamp}' ,${referee}, '${stadium}')`
    );
    return true;
  }
  catch(e){
    throw e;
  }
}

/**
 * This function get the games info by a given games_ids array
 */
async function getGamesInfo(games_ids_array) {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();   

  favorite_game_info = [];
  await Promise.all(games_ids_array.map( async (id) => {
    const game = await DButils.execQuery(
      `SELECT * FROM dbo.Games WHERE game_id = '${id}' `
    )
    
    // deleting past games from favorite
    if (game[0].game_timestamp < timestamp){
       await DButils.execQuery(`DELETE FROM dbo.FavoriteGames WHERE game_id = '${id}' `)
    }
    else
      favorite_game_info.push(game[0]);

  }));

  // sorting the games by date (increasing)
  favorite_game_info.sort(function(first, second) {
    return first.game_timestamp - second.game_timestamp;
  });
  return favorite_game_info;
}

// ----------------------------- Insert Score --------------------------------
/**
 * This function try to insert a score to game (validate parameters and availabilty first).
 * Client must validate the score input as valid sting
 */
 async function checkAndUpdateScore(game_id, score){
  const curr_timestamp = new Date().getTime();
  // FAR can update score only to past games with no score given
  const old_games_to_update = await DButils.execQuery(
    `SELECT * from dbo.Games WHERE game_timestamp < '${curr_timestamp}' AND score IS NULL AND game_id='${game_id}'`
  );
  try{
    if(old_games_to_update.length != 0 ){
      // UPDATE by game_id - represent to client only games with valid ID's
      await DButils.execQuery(
         `UPDATE dbo.Games SET score='${score}' WHERE game_id = '${game_id}'`
      ); 
    }
    else throw { status: 412 , message:"There are no games to update in the system, all score's are set" }
    return true;
  }
  catch(e){
    throw e;
  }
}
// ----------------------------- Insert Event Log --------------------------------
/**
 * This function try to insert a Event Log to game (validate parameters and availabilty first).
 * Client must validate the input of date,min and description
 */
 async function InsertEventLog(game_id ,date ,hour ,min ,description){

  try{
    const updateLog = await DButils.execQuery(`INSERT INTO dbo.Logs (game_id,game_date,hour,minutes,description) 
                  VALUES('${game_id}','${date}','${hour}','${min}','${description}') `);
    return true;
  }
  catch(e){
    throw { status: 400 , message:"Invalid game_id - Failed to inert Event Log" }
  }
}

async function getEventLog(game_id){
  try{
    const gameLog = await DButils.execQuery(`SELECT * From dbo.Logs WHERE game_id = '${game_id}'`);
    return gameLog;
  }
  catch(e){
    throw { status: 400 , message:"Invalid game_id - Failed to select Event Log" }
  };
}

exports.getPastGames = getPastGames;
exports.getFutureGames = getFutureGames;
exports.getAllFutureGames = getAllFutureGames;
exports.getAllPastGames = getAllPastGames;
exports.checkAndInsertGame = checkAndInsertGame;
exports.getGamesInfo = getGamesInfo;
exports.checkAndUpdateScore = checkAndUpdateScore;
exports.InsertEventLog = InsertEventLog;