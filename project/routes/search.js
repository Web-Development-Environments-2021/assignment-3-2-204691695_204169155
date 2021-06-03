var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");

/**
 * This endpoint search and return a player by a given playerName (is possible to insert playerPosition or teamName to filter the results).
 */
router.get("/players", async (req, res, next) => {
  try {
    // define dedault position and teamName
    const p_position = req.query.playerPosition || "";
    const t_name = req.query.teamName || "";
    
    if(req.query.playerName){
      // search the player by the params
      const players_details = await players_utils.getPlayersByName(
        req.query.playerName, p_position , t_name
      );
      
      // Saving logged-in user last query to session      
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

/**
 * This endpoint search and return a player by a given playerName (is possible to insert playerPosition or teamName to filter the results).
 */
router.get("/teams/:teamName", async (req, res, next) => {
  try {
    
    // search the team by the name
    const team_details = await team_utils.getTeamByName(
      req.params.teamName
    );
    
    // Saving logged-in user last query to session
    req.session.lastQuery = req.params;
    req.session.lastQuery['type'] = "team";
    res.status(201).send(team_details);
  } catch (error) {
    next(error);
  }
});
  
module.exports = router