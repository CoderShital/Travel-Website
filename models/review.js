const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    ratings:{
        type:Number,
        min:1,
        max:5
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Review", reviewSchema);   //schema banaya & model bhi toh banana hoga toh voh banake export kiya