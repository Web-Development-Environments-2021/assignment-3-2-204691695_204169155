var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/:playerName", async (req, res, next) => {
  let players_details = [];
  try {
    const players_details = await players_utils.getPlayersByName(
      req.params.playerName
    );
    res.status(201).send(players_details);
  } catch (error) {
    next(error);
  }
});

module.exports = router;