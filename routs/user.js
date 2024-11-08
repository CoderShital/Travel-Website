const express = require("express");
const Router = express.Router();
const User = require("../models/user");

Router.get("/", (req, res)=>{
    res.render("users/signup.ejs");
});

Router.post("/", async(req, res)=>{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to the WanderLust new User");
    res.redirect("/listings");
})

module.exports = Router;