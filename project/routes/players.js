var express = require("express");
var router = express.Router();
const players_utils = require("./utils/players_utils");

/**
 * This endpoint return the player's page by a given player_id.
 */
router.get("/page/:player_id", async (req, res, next) => {
  try {
    const players_details = await players_utils.getPlayerPersonalPageByID(
      req.params.player_id
    );
    res.status(201).send(players_details);
  } catch (error) {
    next({status: 403, message: "playerID doesn't exists"})
  }
});

module.exports = router;
