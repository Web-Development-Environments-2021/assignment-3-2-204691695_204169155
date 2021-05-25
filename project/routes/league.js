var express = require("express");
var router = express.Router();
const league_utils = require("./utils/league_utils");
const DBUtils = require("./utils/DButils");

/**
 * This endpoint return the league details (main page of the website), if the user is logged-in return the favorite games also.
 */
router.get("/getDetails", async (req, res, next) => {
  try {
    // checks if the user is logged-in
    let user_id = ""
    if (req.session && req.session.user_id) {
      await DBUtils.execQuery("SELECT user_id FROM users_test")
        .then((users) => {
          if (users.find((x) => x.user_id === req.session.user_id)) 
            user_id = req.session.user_id;
        });
    }

    // get the league details
    const league_details = await league_utils.getLeagueDetails(user_id);
    res.status(200).send(league_details);
  } catch (error) {
    next(error);
  }
});


module.exports = router;
