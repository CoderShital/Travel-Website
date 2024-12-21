const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review");


const listSchema = new Schema({
    title:{
        type:String,
        required: true
        },
    description:{
        type:String,
        required: true 
        },
    image: {
        filename: String,
        url: {
            type: String,
        //     default: "https://images.pexels.com/photos/17644421/pexels-photo-17644421/free-photo-of-seagulls-flying-on-sea-shore.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        //     set: (v) => v === "" ? "https://images.pexels.com/photos/17644421/pexels-photo-17644421/free-photo-of-seagulls-flying-on-sea-shore.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" : v,
        // 
        }
    },
    price:{
        type:Number,
        required: true  
        },
    location:{
        type:String,
        required: true
        },
    country:{
        type:String,
        required: true 
         },
    reviews:[
        {
        type: Schema.Types.ObjectId,
        ref: "Review"
      }
   ] ,
   owner:
    {
        type:Schema.Types.ObjectId,
        ref: "User"
    },
    category:{
        type:String,
        enum: ["Trending", "Room", "Amazing pools", "Castle", "Camping", "Island", "Iconic City", "Mountain Sun", "Farm", "Arctic"]
    }
   
});


listSchema.post("findOneAndDelete", async(data) =>{
    if(data){
        await Review.deleteMany({_id: {$in: data.reviews}})
    }
})
const Listings = new mongoose.model("Listing", listSchema);
module.exports = Listings;