const mongoose = require("mongoose");
const Listings = require("../models/listings.js");
const initData = require("./data.js")
const MDB_URL = "mongodb://127.0.0.1:27017/airbnb";


main().then((res)=>{console.log("connected to database");}).catch((err)=>{console.log(err);});
async function main(){
    await mongoose.connect(MDB_URL);
};

const initDB = async()=>{
    await Listings.deleteMany();    //model=collections=Listings----n tyavrch lagtat he sare fun.
    await Listings.insertMany(initData.data);
    console.log("Database is initialised.");
}
initDB();