const express = require("express");
const Router = express.Router();
const Listings = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { populate } = require("../models/review.js");
const listingContoller = require('../controllers/listing.js');
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// const upload = multer({dest:'uploads/'});




//EDIT
Router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingContoller.editListing));

//CREATE NEW - ise id wale rout se upr rkho else new ko id ki tarah treat krne lgega and db mie dhundhne lagega milega nhi toh err .
Router.get("/new", isLoggedIn, wrapAsync(listingContoller.newCreate));

//SHOW DETAILS, UPDATE and DELETE
Router.route("/:id")
      .get(wrapAsync(listingContoller.showListing))
      .put(isLoggedIn, isOwner, upload.single('List[image]'), validateListing, wrapAsync(listingContoller.updateListing))
      .delete(isLoggedIn, isOwner, wrapAsync(listingContoller.deleteListing));

//ALL LISTINGS and POST NEW
Router.route("/")
      .get(wrapAsync(listingContoller.index))
      .post(isLoggedIn, upload.single('List[image]'),validateListing, wrapAsync(listingContoller.postNew));
      


module.exports = Router;