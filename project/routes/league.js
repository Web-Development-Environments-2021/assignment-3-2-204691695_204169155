var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DBUtils = require("./utils/DButils");

/**
 * Left column League page 
 * TODO: right column
 */
router.get("/getDetails", async (req, res, next) => {
  try {
    const league_details = await league_utils.getLeagueDetails();
    res.send(league_details);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
