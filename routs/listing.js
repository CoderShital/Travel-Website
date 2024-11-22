const express = require("express");
const Router = express.Router();
const Listings = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { populate } = require("../models/review.js");
const listingContoller = require('../controllers/listing.js');


//DELETE
Router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingContoller.deleteListing));
//UPDATE
Router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingContoller.updateListing));
//EDIT
Router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingContoller.editListing));
//POST NEW
Router.post("/",validateListing, wrapAsync(listingContoller.postNew));
//CREATE NEW 
Router.get("/new", isLoggedIn, wrapAsync(listingContoller.newCreate));
//SHOW DETAILS
Router.get("/:id", wrapAsync(listingContoller.showListing));
//ALL LISTINGS
Router.get("/", wrapAsync(listingContoller.index));


module.exports = Router;