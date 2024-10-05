const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listings = require("./models/listings");
const path = require("path");
const methodOverride = require("method-override");  // so that we can use put and delete request in http verbs
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listSchema} = require("./schema");
const Review = require("./models/review");

let port = 3000;
let MDB_URL = "mongodb://127.0.0.1:27017/airbnb";

app.set("views" ,path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));

main().then((res)=>{console.log("connected to database.");}).catch((err)=>{console.log(err);});
async function main(){
    await mongoose.connect(MDB_URL);
};

const validateListing = (req, res, next) =>{
    let {error} = listSchema.validate(req.body);
    if(error){
        // let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, error);
    }else{
        next();
    }
};


//Review
app.post("/listings/:id/reviews", async(req, res)=>{
    let listing = await Listings.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await new Listings.save();
    await new newReview.save();

    console.log("new review send");
    res.send("New review send");
});

//DELETE
app.delete("/listings/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    let deleted = await Listings.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    try {
        let List = await Listings.findById(id);
        if (!List) {
            // Handle the case where the listing is not found
            return res.redirect("/listings");
        }
        res.render("./listings/edit.ejs", { List });
    } catch (err) {
        console.error(err);
        res.redirect("/listings");
    }
}));
//EDIT
app.put("/listings/:id",validateListing,wrapAsync(async(req, res)=>{ //id ek rout parameter hai yaha jiska var create krna pdega and req.params se URL se usko extract kr lenge.
    // if(!req.body.list){
    //     throw new ExpressError(400, "Send valid data for listing.");
    // };
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.List});   //deconstruct : objects ki multiple properties ko extract krna eksath
    res.redirect(`/listings/${id}`);

}));
//POST NEW
app.post("/listings",validateListing, wrapAsync(async(req, res, next)=>{
    const newListing = new Listings(req.body.list);
    await newListing.save();
    console.log(req.body);  //This will print the form data entered by user.
    res.redirect("/listings");
    })
);
//CREATE NEW 
app.get("/listings/new", wrapAsync(async(req, res)=>{
    let list = await Listings.find();
    res.render("./listings/create.ejs", {list});
}));
//SHOW DETAILS
app.get("/listings/:id", wrapAsync(async(req, res)=>{
    let {id} = req.params;
    const Listing = await Listings.findById(id); 
    res.render("listings/show.ejs", { Listing });
}));

//ALL LISTINGS
app.get("/listings", wrapAsync(async(req,res)=>{
    let allListings = await Listings.find({});
    //console.log(allListings);
    res.render("./listings/index.ejs",{allListings});
}));
//HOME
app.get("/", (req, res)=>{
    //let msg = "WELCOME TO HOME PAGE.\nTHIS IS A ROOT." 
    //res.send(msg);
    res.render("./listings/Home.ejs");
});


app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page not found!"));
});                                                     //if didn't match with any of our domain rout then comes here.
app.use((err, req, res, next)=>{
    // res.send("Something went wrong!");
    let {status = 401, message="Something went wrong!"} = err;
    res.status(status).render("./listings/error.ejs", {err});
    // res.status(status).send(message);
});
app.listen(port, ()=>{
    console.log(`app is listening on the port ${port}.`);
});







// app.post("/listings", async(req, res)=>{
//     let {title, description, image, price, location, country} = req.body;   //extract data from inputs
//     console.log(title);
//     let newListing = new Listings({                //schema bnvla hota tyachyat value taka ata ith je {var} bnvle na tyatun.
//         title:title,
//         description:description,
//         image:image,                               //create ko id wale rout k upr likho coz voh '/new' ko as an id le leta hai n use search krta hai toh voh to milegi nhi to error deta hai 
//         price:price,
//         location:location,
//         country:country
//     })
//     await newListing.save()
//     res.redirect("/listings");
// });

//EDIT 
// app.get("/listings/:id/edit", async(req, res)=>{
// let {id} = req.params;
// const List = await Listings.findById(id);
// res.render("./listings/edit.ejs", {List});
// });
// app.post("/listings", wrapAsync(async(req, res, next)=>{
    //    try{
    //     const newListing = new Listings(req.body.list);
    //     await newListing.save();
    //     //console.log(req.body);  This will print the form data entered by user.
    //     res.redirect("/listings");
    //    }catch(err){
    //     next(err);
    
   // app.post("/listings", wrapAsync(async(req, res, next)=>{
        // let result = listSchema.validate(req.body);
        // console.log(result);
        // if(result.error){
        //     throw new ExpressError(400, result.error);
        // }
        // if(!req.body.list){
        //     throw new ExpressError(400, "Send valid data for listing.");
        // };