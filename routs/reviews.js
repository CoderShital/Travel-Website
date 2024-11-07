const express = require("express");
const Router = express.Router({mergeParams: true});
const Review = require("../models/review");
const Listings = require("../models/listings");
const wrapAsync = require("../utils/wrapAsync");
const {listSchema, reviewSchema} = require("../schema");
const ExpressError = require("../utils/ExpressError");



const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
};

//Post Review
Router.post("/", validateReview, wrapAsync(async(req, res)=>{
    let listing = await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review); //review => review object ee form madhe name madhe pass kelel.
    listing.reviews.push(newReview); //reviews => array -- listing ali- reviews cha array pn sobt ala--tyat new_listing taka. 

        await newReview.save();
        await listing.save();

   // console.log("new review send");
    req.flash("success", "New review is created!");
    res.redirect(`/listings/${listing._id}`);
}));
//Delete Review
Router.delete("/:reviewId", wrapAsync(async(req, res)=>{
    let{id, reviewId} = req.params;

    await Listings.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId); 
    req.flash("success", "The review is deleted!");
    res.redirect(`/listings/${id}`);
}));

module.exports = Router;