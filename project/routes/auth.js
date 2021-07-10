var express = require("express");
var router = express.Router();
const DButils = require("../routes/utils/DButils");
const bcrypt = require("bcryptjs");

/**
 * This endpoint get username and password and try register a new user to the system
 */
router.post("/Register", async (req, res, next) => {
  try {  
    const users = await DButils.execQuery("SELECT username FROM dbo.users");    

    // checks if username exists
    if (req.body.username && users.find((x) => x.username === req.body.username)){
      throw { status: 409, message: "Username taken" };
    }

    //hash the password
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    req.body.password = hash_password;

    // add the new username
    await DButils.execQuery(
      `INSERT INTO dbo.users (username, password,first_name,last_name,country,email,profile_pic) VALUES ('${req.body.username}', '${hash_password}','${req.body.first_name}','${req.body.last_name}','${req.body.country}','${req.body.email}','${req.body.profile_pic}')`
    );
    res.status(201).send("user created");
  } catch (error) {
    next(error);
  }
});

/**
 * This endpoint get username and password and try Login a user to the system
 */
router.post("/Login", async (req, res, next) => {
  try {
    // check that username exists
    const user = (await DButils.execQuery(`SELECT * FROM dbo.users WHERE username = '${req.body.username}'`))[0];

    // check that username exists & the password is correct
    if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.user_id = user.user_id;

    // return cookie
    res.status(200).send(user.profile_pic);
  } catch (error) {
    next(error);
  }
});

/**
 * This endpoint Logout the user from the system
 */
router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
