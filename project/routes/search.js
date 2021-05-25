var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");

///:playerName/:playerPosition/:groupName
router.get("/players", async (req, res, next) => {
  try {
    const p_position = req.query.playerPosition || "";
    const g_name = req.query.groupName || "";
    
    if(req.query.playerName){
      const players_details = await players_utils.getPlayersByName(
        req.query.playerName, p_position , g_name
      );
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
    res.status(201).send(team_details);
  } catch (error) {
    next(error);
  }
});
  
module.exports = router