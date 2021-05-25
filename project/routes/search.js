var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");

router.get("/players", async (req, res, next) => {
  try {
    const p_position = req.query.playerPosition || "";
    const g_name = req.query.groupName || "";
    
    if(req.query.playerName){
      const players_details = await players_utils.getPlayersByName(
        req.query.playerName, p_position , g_name
      );
      //saving last query to session
      req.session.lastQuery = req.query;
      req.session.lastQuery['type'] = "player";
      res.status(201).send(players_details);
    }
    else{
      throw {status: 400, message: "You must enter a player name"};
    }
  } catch (error) {
    next(error);
  }
});

router.get("/teams/:teamName", async (req, res, next) => {
  try {
    const team_details = await team_utils.getTeamByName(
      req.params.teamName
    );
    //saving last query to session
    req.session.lastQuery = req.params;
    req.session.lastQuery['type'] = "team";
    res.status(201).send(team_details);
  } catch (error) {
    next(error);
  }
});
  
module.exports = router