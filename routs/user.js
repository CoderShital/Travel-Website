const express = require("express");
const Router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

Router.get("/", (req, res)=>{
    res.render("users/signup.ejs");
});

Router.post("/", wrapAsync(async(req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to the WanderLust new User");
        res.redirect("/listings");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));

Router.get("/login", async(req, res)=>{
    res.render("users/login.ejs");
});
Router.post("/login",
     passport.authenticate("local", {failureRedirect: '/signup/login', failureFlash:true}),
     (req, res)=>{
        res.redirect("/listings");
    //  res.send("Welcome to Wanderlust. You are logged in!");
});

module.exports = Router;