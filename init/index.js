const mongoose = require("mongoose");
const Listings = require("../models/listings.js");
const initData = require("./data.js")
// const MDB_URL = "mongodb://127.0.0.1:27017/airbnb";
// const ATLASDB = "mongodb://Ks_atlas:0pqXlrBbaN0X1lTy@cluster0.x2nfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const ATLASDB_URL="mongodb+srv://Ks_atlas:0pqXlrBbaN0X1lTy@cluster0.x2nfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&ssl=true"
// const ATLASDB = process.env.ATLASDB_URL;


main().then((res)=>{console.log("connected to database");}).catch((err)=>{console.log(err);});
async function main(){
    await mongoose.connect(ATLASDB_URL);
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