const DButils = require("./DButils");
const axios = require("axios");

/**
 * This function mark a game id as favorite to a specific user_id
 */
async function markGameAsFavorite(user_id, game_id) {
  const currentDate = new Date();
  const timestamp = currentDate.getTime();  
  try{
    const game = await DButils.execQuery(
      `SELECT game_timestamp FROM dbo.Games WHERE game_id='${game_id}'`
    );
    
    if(game[0].game_timestamp >= timestamp){
      try{
        await DButils.execQuery(
          `INSERT INTO dbo.FavoriteGames VALUES ('${user_id}',${game_id})`
        );
      }
      catch{
        throw {status:400 , message: "Game is already in the user's 'Favorite Games'"};
      }
    }
    else{
      throw {status: 400 , message: "Game date must be in the future"};
    }    
  } catch(err){
      if(err.status !== 400)
        throw {status:400 , message: "Wrong Game ID"};
      else
        throw err;
  }
}

/**
 * This function get all the favorite games of a user (by user id).
 * @param {*} user_id - the user id to search by
 */
async function getFavoriteGames(user_id) {
  const games_ids = await DButils.execQuery(
    `SELECT game_id FROM dbo.FavoriteGames WHERE user_id='${user_id}'`
  );
  return games_ids;
}

/**
 * This function return all autorized countries
 */
async function getCountries(){
  const result = await axios.get('https://restcountries.eu/rest/v2/all');
  return result;
}

exports.markGameAsFavorite = markGameAsFavorite;
exports.getFavoriteGames = getFavoriteGames;
exports.getCountries = getCountries;
