const Listings = require("../models/listings");
const Review = require("../models/review");


module.exports.postReview = async(req, res)=>{
    let listing = await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review); //review => review object ee form madhe name madhe pass kelel.
    newReview.author = req.user._id;
    //console.log(newReview);
    listing.reviews.push(newReview); //reviews => array -- listing ali- reviews cha array pn sobt ala--tyat new_listing taka. 

        await newReview.save();
        await listing.save();

   // console.log("new review send");
    req.flash("success", "New review is created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req, res)=>{
    let{id, reviewId} = req.params;
    await Listings.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId); 
    req.flash("success", "The review is deleted!");
    res.redirect(`/listings/${id}`);
};