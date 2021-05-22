const axios = require("axios");
const { markPlayerAsFavorite } = require("./users_utils");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
// const TEAM_ID = "85";

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

function extractRelevantPlayerData(players_info) {
  return players_info.map((player_info) => {
    const { fullname, image_path, position_id } = player_info.data.data;
    const { name } = player_info.data.data.team.data;
    return {
      name: fullname,
      image: image_path,
      position: position_id,
      team_name: name,
    };
  });
}

async function getPlayersByTeam(team_id) {
  let player_ids_list = await getPlayerIdsByTeam(team_id);
  let players_info = await getPlayersInfo(player_ids_list);
  return players_info;
}

// ours

async function getPlayersByName(player_name) {
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
  return extractRelevantPlayerDataByName(players_info)
}

function extractRelevantPlayerDataByName(players) {
  return players[0].data.data.map((player_info) => {
    const { player_id, fullname, image_path, position_id } = player_info;
    
    // TODO: ask if player without team should be return
    if(player_info && player_info.team){
      return {
        player_id: player_id,
        name: fullname,
        image: image_path,
        position: position_id,
        team_name: player_info.team.data.name
      }; 
    }  
  });
}


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

function extractRelevantPlayerPageDataByID(players) {
  const player_info = players[0].data.data;
  const {player_id ,fullname, image_path, position_id, common_name, nationality, birthdate, birthcountry, height, weight,  } = player_info;
  
  // TODO: ask if player without team should be return
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
