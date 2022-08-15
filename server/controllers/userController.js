/* ----------------- Dependencies ----------------- */
const bcrypt = require("bcrypt");
const UserDB = require("../models/userDB");

const {
  createToken,
  checkAdmin,
  decodeJwt,
} = require("../middlewares/jwtMiddleware");

const ErrorHandler = require("../helpers/errorHandler");
var userDB = new UserDB();

module.exports = {
  /* ----------------- User CRUD Controllers ----------------- */
  createUser: async (req, res, next) => {
    try {
      console.log("createUser called");
      const body = req.body;

      //hash password
      await bcrypt.hash(body.password, 10).then((hash) => {
        //reassign body.password to be the hashed password
        body.password = hash;
      });
      //send the data into DB
      const sqlResult = await userDB.newUserRegister(body);
      console.log("created user");
      return res.status(200).json({
        success: 1,
        message: "Successfully inserted into DB",
        result: sqlResult,
      });
    } catch (error) {
      return res.status(409).json({ error });
    }
  },

  getUserByMyId: async (req, res, next) => {
    try {
      const token = await req.cookies["access-token"];
      const userId = decodeJwt(token);
      const sqlResult = await userDB.getUserById(userId);
      // if no results returned, this means that a user with that id does not exist
      if (!sqlResult.length) {
        throw new ErrorHandler("Record of user not found!", 404);
      }
      return res.json({
        success: 1,
        result: sqlResult,
      });
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    console.log("updateUser");
    try {
      const body = req.body;
      //send the update changes to the DB
      const token = await req.cookies["access-token"];
      const userId = decodeJwt(token);
      const sqlResult = await userDB.updateUser(body, userId);
      if (!sqlResult) {
        console.log("failed to update user");
        throw new ErrorHandler("failed to update user", 400);
      }
      return res.json({
        success: 1,
        message: "Successfully updated into DB",
        result: sqlResult,
      });
    } catch (error) {
      next(error);
    }
  },
};
