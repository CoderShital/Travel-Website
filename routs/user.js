const express = require("express");
const Router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

Router.get("/", (req, res)=>{
    res.render("users/signup.ejs");
});

Router.post("/", wrapAsync(async(req, res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
        req.flash("success", `Welcome to the Wanderlust ${username}`);
        res.redirect("/listings");
        })
      
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));

Router.get("/login", async(req, res)=>{
    res.render("users/login.ejs");
});
Router.post("/login",saveRedirectUrl,
     passport.authenticate("local", {failureRedirect: '/signup/login', failureFlash:true}),
     async(req, res)=>{
    req.flash("success", "Welcome back to Wanderlust!");
    let redirect = res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
});

Router.get("/logout", (req, res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out successfully!");
        res.redirect("/listings");
    });
});


module.exports = Router;