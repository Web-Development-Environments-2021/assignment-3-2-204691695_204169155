var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const games_utils = require("./utils/games_utils");

/**
 * Authenticate all incoming requests by middleware (only permitted users)
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
          next();
        } else {
          throw {
            status: 401, message: "you must login in order to access this page"
          }
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This endpoint gets game_id and save this game in the favorites list of the logged-in user
 */
router.post("/favoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const game_id = req.body.game_id;
    await users_utils.markGameAsFavorite(user_id, game_id);
    res.status(201).send("The Game successfully saved as favorite");
  } catch (error) {
    next(error);
  }
}); 

/**
 * This endpoint returns the favorites games that were saved by the logged-in user
 */
router.get("/favoriteGames", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const game_ids = await users_utils.getFavoriteGames(user_id);
    let games_ids_array = [];
    game_ids.map((element) => games_ids_array.push(element.game_id)); //extracting the games ids into array
    const results = await games_utils.getGamesInfo(games_ids_array);
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
