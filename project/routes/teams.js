var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let team_details = [];
  console.log("here and id="+req.params.teamId);
  try {
    const team_details = await players_utils.getPlayersByTeam(
      req.params.teamId
    );
    //we should keep implementing team page.....
    res.send(team_details);
  } catch (error) {
    next(error);
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
