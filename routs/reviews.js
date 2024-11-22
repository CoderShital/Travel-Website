const express = require("express");
const Router = express.Router({mergeParams: true});
const Review = require("../models/review");
const Listings = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require('../controllers/reviews.js');

//Post Review
Router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.postReview));
//Delete Review
Router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview ));

module.exports = Router;