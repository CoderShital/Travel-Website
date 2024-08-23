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
    image: {
        filename: String,
        url: {
            type: String,
            default: "https://images.pexels.com/photos/17644421/pexels-photo-17644421/free-photo-of-seagulls-flying-on-sea-shore.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            set: (v) => v === "" ? "https://images.pexels.com/photos/17644421/pexels-photo-17644421/free-photo-of-seagulls-flying-on-sea-shore.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" : v,
        }
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