const express = require("express");
const Router = express.Router();
const Listings = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js")
 


//DELETE
Router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async(req, res)=>{
    let {id} = req.params;
    let deleted = await Listings.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "The Listing is deleted!");
    res.redirect("/listings");
}));
//UPDATE
Router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async(req, res)=>{ //id ek rout parameter hai yaha jiska var create krna pdega and req.params se URL se usko extract kr lenge.

    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.List});   //deconstruct : objects ki multiple properties ko extract krna eksath
    req.flash("success", "The Listing is Updated!");
    res.redirect(`/listings/${id}`);

}));
//EDIT
Router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const List = await Listings.findById(id);

        if(!List){
            req.flash("error", "The Listing you've requested for does not exits!");
            res.redirect("/listings");
        }
        res.render("./listings/edit.ejs", { List });
    }
));

//POST NEW
Router.post("/",validateListing, wrapAsync(async(req, res, next)=>{
    const newListing = new Listings(req.body.List);
    newListing.owner = req.user._id;
    await newListing.save();
   // console.log(req.body);  //This will print the form data entered by user.
    req.flash("success", "New Listing is added!");
    res.redirect("/listings");
    })
);
//CREATE NEW 
Router.get("/new", isLoggedIn, wrapAsync(async(req, res)=>{
    let List = await Listings.find();
    res.render("./listings/create.ejs", {List});
}));
//SHOW DETAILS
Router.get("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const Listing = await Listings.findById(id).populate("reviews").populate("owner"); 
    if(!Listing){
        req.flash("error", "The Listing you've requested for does not exits!");
        res.redirect("/listings");
    }
    console.log(Listing);
    res.render("listings/show.ejs", { Listing });
}));
//ALL LISTINGS
Router.get("/", wrapAsync(async(req,res)=>{
    let allListings = await Listings.find({});
    //console.log(allListings);
    res.render("./listings/index.ejs",{allListings});
}));


module.exports = Router;