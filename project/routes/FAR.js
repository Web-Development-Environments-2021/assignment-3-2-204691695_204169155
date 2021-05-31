var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const game_utils = require("./utils/games_utils");
const far_utils = require("./utils/far_utils");

/**
 * Authenticate all incoming requests by middleware (just far user can pass it)
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        // username = FAR , password = FAR123456
        if (users.find((x) => x.user_id === req.session.user_id  && req.session.user_id == '5921CEE8-78A2-4EF4-AEF1-DDF92316AE48')) {
          req.user_id = req.session.user_id;
          next();
        }
        else throw { status: 401 , message:"Unautorized"}
      })
      .catch((err) => next(err));
  } else {
    res.status(401).send("Unautorized");
  }
});

/**
 * This endpoint return the FAR Page details 
 */
router.get("/", async (req, res, next) => {
    try {
        const far_page_details = await far_utils.getFarPageDetails();
        res.status(200).send(far_page_details);
    } catch (error) {
      next(error);
    }
});


/**
 *  This endpoint try to add a new game to the system
 */
router.post("/addNewGame", async (req, res, next) => {
    try {
        const auth_game = await game_utils.checkAndInsertGame(req.body.homeTeam, req.body.visitorTeam, req.body.date, req.body.hour, req.body.referee, req.body.stadium);
        if(auth_game){
            res.status(201).send("Game added")
        }
        else { throw {
            status: 401,
            message: "Failed to insert game",
        }
      }
    } catch (error) {
      next(error);
    }
});
/**
 *  This endpoint try to update a score of a single game
 */
router.post("/addScore", async (req, res, next) => {
  try {
      const auth_event = await game_utils.checkAndUpdateScore(req.body.game_id,req.body.score);
      if(auth_event){
          res.status(201).send("Score added")
      }
      else { throw {
          status: 401,
          message: "Failed to insert score",
      }
    }
  } catch (error) {
    next(error);
  }
});
/**
 *  This endpoint Inseret a Event Log to a valid game ID
 */
router.post("/addEventLog", async (req, res, next) => {
  try {
    console.log(req.body);
      const auth_score = await game_utils.InsertEventLog(req.body.game_id, req.body.date, req.body.hour, req.body.minutes, req.body.description);
      if(auth_score){
          res.status(201).send("Event Log added")
      }
      else { throw {
          status: 401,
          message: "Failed to insert Event Log",
      }
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router