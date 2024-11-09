const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");  // so that we can use put and delete request in http verbs
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const ExpressError = require("./utils/ExpressError");
const Listings = require("./models/listings");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user");



const listing = require("./routs/listing");
const reviews = require("./routs/reviews");
const user = require("./routs/user");

let port = 3000;
let MDB_URL = "mongodb://127.0.0.1:27017/airbnb";

main().then((res)=>{console.log("connected to database.");}).catch((err)=>{console.log(err);});
async function main(){
    await mongoose.connect(MDB_URL);
};

app.set("views" ,path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// app.use(bodyParser.urlencoded({extended: true}));


const sessionOptions = {
    secret: "mysecretecode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*100,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
app.use(session(sessionOptions));
app.use(flash());     //flash jya routes sathi vaprtoy tyachya adhich defined or used kel pahije.

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;  //bcoz we can't access this user object directly in ejs template.
    next();
})


// app.get("/demo", async(req, res)=>{
//     let fakeUser = new User({
//         email: "abc@gmail.com",
//         username: "Joy"
//     });
//     let registeredUser = await User.register(fakeUser, "hello");
//     res.send(registeredUser);
// });
app.use("/listings", listing);
app.use("/listings/:id/reviews", reviews);
app.use("/signup", user);


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