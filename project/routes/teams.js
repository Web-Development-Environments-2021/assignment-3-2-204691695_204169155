var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const games_utils = require("./utils/games_utils");

router.get("/page/:teamId", async (req, res, next) => {
  let team_details = {};
  try {
    team_details["players"] = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    
    team_details["past_games"] = await games_utils.getPastGames(
       req.params.teamId
    );

    team_details["future_games"] = await games_utils.getFutureGames(
      req.params.teamId
    );

    res.send(team_details);
  } catch (error) {
    next({status: 403, message: "team_id doesn't exists"});
  }
});

router.get("/:TeamName", async (req, res, next) => {
  let players_details = [];
  try {
    const Team_details = await players_utils.getTeamByName(
      req.params.TeamName
    );
    res.status(201).send(Team_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
