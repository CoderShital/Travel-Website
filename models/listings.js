const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = Schema({
    title:{
        type:String,
        required: true,
    },
    description:{
        type:String,
    },
    image:{
        filename:String,
        url:String,
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
    },
    country:{
        type:String,
        required:true,
    }
});

const Listings = new mongoose.model("Listing", listSchema);
module.exports = Listings;