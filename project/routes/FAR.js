var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const game_utils = require("./utils/games_utils");
const far_utils = require("./utils/far_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users_test")
      .then((users) => {
          // username = asaf , password = 123456
        if (users.find((x) => x.user_id === req.session.user_id  && req.session.user_id == '46F4271C-B3A4-464F-8F4C-869659E3C6A3')) {
          req.user_id = req.session.user_id;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * FAR Page information 
 */
router.get("/", async (req, res, next) => {
    try {
        const far_page_details = await far_utils.getFarPageDetails();
        res.send(far_page_details);
    } catch (error) {
      next(error);
    }
});


/**
 *  Adding new game to the system
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

module.exports = router

// ------------------- בונוס ----------------------
// router.post("/addScore", async (req, res, next) => {
//     try {
      
//     } catch (error) {
//       next(error);
//     }
// });
// router.post("/addLogEvent", async (req, res, next) => {
//     try {
      
//     } catch (error) {
//       next(error);
//     }
// });