const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchSchema = new Schema({
    search:{
        type:String
    }
});

module.exports = mongoose.model("Search", searchSchema);
