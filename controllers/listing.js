const Listings = require("../models/listings");

module.exports.index = async(req,res)=>{
    let allListings = await Listings.find({});
    //console.log(allListings);
    res.render("./listings/index.ejs",{allListings});
};

module.exports.newCreate = async(req, res)=>{
    let List = await Listings.find();
    res.render("./listings/create.ejs", {List});
};

module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
    const Listing = await Listings.findById(id).populate({path: "reviews", populate:{path: "author"},}).populate("owner"); 
    if(!Listing){
        req.flash("error", "The Listing you've requested for does not exits!");
        res.redirect("/listings");
    }
    //console.log(Listing);
    res.render("listings/show.ejs", { Listing });
};

module.exports.postNew = async(req, res, next)=>{
    const newListing = new Listings(req.body.List);
    newListing.owner = req.user._id;
    await newListing.save();
   // console.log(req.body);  //This will print the form data entered by user.
    req.flash("success", "New Listing is added!");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const List = await Listings.findById(id);

        if(!List){
            req.flash("error", "The Listing you've requested for does not exits!");
            res.redirect("/listings");
        }
        res.render("./listings/edit.ejs", { List });
};

module.exports.updateListing = async(req, res)=>{ //id ek rout parameter hai yaha jiska var create krna pdega and req.params se URL se usko extract kr lenge.

    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.List});   //deconstruct : objects ki multiple properties ko extract krna eksath
    req.flash("success", "The Listing is Updated!");
    res.redirect(`/listings/${id}`);

};

module.exports.deleteListing = async(req, res)=>{
    let {id} = req.params;
    let deleted = await Listings.findByIdAndDelete(id);
    console.log(deleted);
    req.flash("success", "The Listing is deleted!");
    res.redirect("/listings");
};
