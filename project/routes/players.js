var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");

router.get("/:playerName", async (req, res, next) => {
  console.log("path: " + req.params.playerName);
  let players_details = [];
  try {
    const players_details = await players_utils.getPlayersByName(
      req.params.playerName
    );

    console.log(players_details.data.data);
    //we should keep implementing team page.....
  } catch (error) {
    next(error);
  }
});

module.exports = router;
