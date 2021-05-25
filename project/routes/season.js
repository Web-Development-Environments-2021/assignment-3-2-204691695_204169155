var express = require("express");
var router = express.Router();
const games_utils = require("./utils/games_utils");

/**
 * This endpoint return the games in the system (seperated by past/future games).
 */
router.get("/", async (req, res, next) => {
  let current_season_games_details = {};
  try {
    current_season_games_details["past_games"] = await games_utils.getAllPastGames();
    current_season_games_details["future_games"] = await games_utils.getAllFutureGames();
    res.status(201).send(current_season_games_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
