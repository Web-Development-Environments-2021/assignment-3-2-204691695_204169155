var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");
const games_utils = require("./utils/games_utils");

/**
 * This endpoint return the team page
 */
router.get("/page/:teamId", async (req, res, next) => {
  let team_details = {};
  try {
    // get the team's players 
    team_details["players"] = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    
    // get the team's past games
    team_details["past_games"] = await games_utils.getPastGames(
       req.params.teamId
    );

    // get the team's future games
    team_details["future_games"] = await games_utils.getFutureGames(
      req.params.teamId
    );

    res.send(team_details);
  } catch (error) {
    next({status: 403, message: "team_id doesn't exists"});
  }
});


module.exports = router;
