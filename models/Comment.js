
const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
    video:{
        type:mongoose.Schema.ObjectId,
        ref:'Catalogue',
        required:true
    },
    commentBy:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true 
    },
    comment:{
        type:String,
        required:true
    }
},{
  timestamps:true
});


module.exports = mongoose.model("CommentSchema", CommentSchema, "comments");
