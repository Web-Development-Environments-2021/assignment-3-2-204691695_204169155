var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const team_utils = require("./utils/team_utils");

router.get("/players/:playerName", async (req, res, next) => {
    try {
      const players_details = await players_utils.getPlayersByName(
        req.params.playerName
      );
      res.status(201).send(players_details);
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