var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const users_utils = require("./utils/users_utils");
const players_utils = require("./utils/players_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users_test")
      .then((users) => {
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

router.get("/", async (req, res, next) => {
    try {
      
    } catch (error) {
      next(error);
    }
});
router.post("/addNewGame", async (req, res, next) => {
    try {
        
    
    } catch (error) {
      next(error);
    }
});
router.post("/addScore", async (req, res, next) => {
    try {
      
    } catch (error) {
      next(error);
    }
});
router.post("/addLogEvent", async (req, res, next) => {
    try {
      
    } catch (error) {
      next(error);
    }
});