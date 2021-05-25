var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/page/:player_id", async (req, res, next) => {
  try {
    const players_details = await players_utils.getPlayerPersonalPageByID(
      req.params.player_id
    );
    res.status(201).send(players_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
