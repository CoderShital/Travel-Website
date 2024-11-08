const express = require("express");
const Router = express.Router();
const {listSchema} = require("../schema");
const ExpressError = require("../utils/ExpressError");
const Listings = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");

const validateListing = (req, res, next) =>{
    let {error} = listSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
};

//DELETE
Router.delete("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    let deleted = await Listings.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "The Listing is deleted!");
    res.redirect("/listings");
}));
//UPDATE
Router.put("/:id",validateListing,wrapAsync(async(req, res)=>{ //id ek rout parameter hai yaha jiska var create krna pdega and req.params se URL se usko extract kr lenge.
    // if(!req.body.list){
    //     throw new ExpressError(400, "Send valid data for listing.");
    // };
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.List});   //deconstruct : objects ki multiple properties ko extract krna eksath
    req.flash("success", "The Listing is Updated!");
    res.redirect(`/listings/${id}`);

}));
//EDIT
Router.get("/:id/edit", wrapAsync(async (req, res) => {
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
    await newListing.save();
   // console.log(req.body);  //This will print the form data entered by user.
    req.flash("success", "New Listing is added!");
    res.redirect("/listings");
    })
);
//CREATE NEW 
Router.get("/new", wrapAsync(async(req, res)=>{
    let List = await Listings.find();
    res.render("./listings/create.ejs", {List});
}));
//SHOW DETAILS
Router.get("/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const Listing = await Listings.findById(id).populate("reviews"); 
    if(!Listing){
        req.flash("error", "The Listing you've requested for does not exits!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { Listing });
}));
//ALL LISTINGS
Router.get("/", wrapAsync(async(req,res)=>{
    let allListings = await Listings.find({});
    //console.log(allListings);
    res.render("./listings/index.ejs",{allListings});
}));


module.exports = Router;