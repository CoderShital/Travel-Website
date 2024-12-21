const express = require("express");
const Router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/user");

Router.route("/")
      .get(userController.renderSignupForm)
      .post( wrapAsync(userController.signup));

Router.route("/login")
      .get( userController.renderLoginForm)
      .post(saveRedirectUrl,passport
        .authenticate("local", 
            { failureRedirect: '/signup/login', 
            failureFlash:true
            }),                  //actually login toh passport krva raha hai but still humne login naam de diya niche
         userController.login
        );

Router.get("/logout",userController.logOut);
 

module.exports = Router;