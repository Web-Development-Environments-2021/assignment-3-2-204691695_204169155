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
    let user_id = ""
    if (req.session && req.session.user_id) {
      await DBUtils.execQuery("SELECT user_id FROM users_test")
        .then((users) => {
          if (users.find((x) => x.user_id === req.session.user_id)) 
            user_id = req.session.user_id;
        });
      }
    const league_details = await league_utils.getLeagueDetails(user_id);
    res.status(201).send(league_details);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
