const mongoose = require("mongoose");
const Listings = require("../models/listings.js");
const initData = require("./data.js")
const ATLASDB = process.env.ATLASDB_URL;


main().then((res)=>{console.log("connected to database");}).catch((err)=>{console.log(err);});
async function main(){
    await mongoose.connect(ATLASDB);
};

const initDB = async()=>{
    await Listings.deleteMany();    //model=collections=Listings----n tyavrch lagtat he sare fun.
     initData.data = initData.data.map((obj)=>({...obj,
        owner: "672df0f52d992b35111ac6ff"                //map function k through database ko reinitialized krke add kiya owner
    }));
    await Listings.insertMany(initData.data);
    console.log("Database is initialised.");
}
initDB();