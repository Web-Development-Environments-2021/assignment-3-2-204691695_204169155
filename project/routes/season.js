var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const games_utils = require("./utils/games_utils");

router.get("/", async (req, res, next) => {
  let current_season_games_details = {};
  try {
    current_season_games_details["past_games"] = await games_utils.getAllPastGames();
    current_season_games_details["future_games"] = await games_utils.getAllFutureGames();
    res.send(current_season_games_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
