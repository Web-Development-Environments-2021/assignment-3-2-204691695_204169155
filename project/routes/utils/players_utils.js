const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";

/**
 * This function return a list of players_ids that belongs to a given team_id
 */
async function getPlayerIdsByTeam(team_id) {
  let player_ids_list = [];
  const team = await axios.get(`${api_domain}/teams/${team_id}`, {
    params: {
      include: "squad",
      api_token: process.env.api_token,
    },
  });
  team.data.data.squad.data.map((player) =>
    player_ids_list.push(player.player_id)
  );
  return player_ids_list;
}

/**
 * This function return a players_dict by given a players_ids list
 */
async function getPlayersInfo(players_ids_list) {
  let promises = [];
  players_ids_list.map((id) =>
    promises.push(
      axios.get(`${api_domain}/players/${id}`, {
        params: {
          api_token: process.env.api_token,
          include: "team",
        },
      })
    )
  );
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerData(players_info);
}

/**
 * This function extract the relevant data for a player, given a players_info
 */
function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { player_id, fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      player_id: player_id,
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}

/**
 * This function gets a team_id and return all the players in the team
 */
async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

/**
 * This function return players by player's name (optional filtering: player_position and group_name)
 */
async function getPlayersByName(player_name, player_pos, group_name) {
  let promises = [];
  promises.push(
    await axios.get(`${api_domain}/players/search/${player_name}`, {
      params: {
        api_token: process.env.api_token,
        include: "team",
      },
    })
  )
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerDataByName(players_info, player_pos, group_name)
}

/**
 * This function extract the relevant players_info (and filtering by player's position and group_name if necessary)
 */
function extractRelevantPlayerDataByName(players, player_pos, group_name) {
  let players_data = players[0].data.data;
  
  players_data = players_data.filter(function (elem) {
    return elem != null;
  });

  // Filter by player's position
  if(player_pos != "")
    players_data = players_data.filter((player_info) => player_info.position_id == player_pos)

  // Filter by group's name
  if(group_name != ""){
    players_data = players_data.filter((player_info) => player_info.team && player_info.team.data.name == group_name)
  }
  
  // Extract relevant data 
  return players_data.map((player_info) => {
    const { player_id, fullname, image_path, position_id } = player_info;
    var team_name = "";
    try{
      team_name = player_info.team.data.name
    }
    catch{
      team_name = "not define";
    }
    
        if(player_info){
      return {
        player_id: player_id,
        name: fullname,
        image: image_path,
        position: position_id? position_id.toString() : "unknown",
        team_name: team_name,
      }; 
    }  
  });
}

/**
 * This function return the player personal page details by given a player_id
 */
async function getPlayerPersonalPageByID(player_id){
  let promises = [];
  promises.push(
    await axios.get(`${api_domain}/players/${player_id}`, {
      params: {
        api_token: process.env.api_token,
        include: "team",
      },
    })
  )
  let players_info = await Promise.all(promises);
  return extractRelevantPlayerPageDataByID(players_info)
}

/**
 * This function extract and return the relevant player personal page's details
 */
function extractRelevantPlayerPageDataByID(players) {
  const player_info = players[0].data.data;
  const {player_id ,fullname, image_path, position_id, common_name, nationality, birthdate, birthcountry, height, weight,  } = player_info;
  
  if(player_info && player_info.team){
    return {
      player_id: player_id,
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: player_info.team.data.name,
      common_name: common_name,
      nationality: nationality,
      birthdate: birthdate,
      birthcountry: birthcountry, 
      height: height,
      weight: weight,
    }; 
  }  
}

exports.getPlayersByTeam = getPlayersByTeam;
exports.getPlayersInfo = getPlayersInfo;
exports.getPlayersByName = getPlayersByName;
exports.getPlayerPersonalPageByID = getPlayerPersonalPageByID;
