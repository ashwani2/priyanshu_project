
const mongoose = require("mongoose");
const LikeSchema = new mongoose.Schema({
    video:{
        type:mongoose.Schema.ObjectId,
        ref:'Catalogue',
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true 
    }
},{
  timestamps:true
});


module.exports = mongoose.model("LikeSchema", LikeSchema, "likes");
