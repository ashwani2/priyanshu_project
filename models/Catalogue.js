
const mongoose = require("mongoose");
const CatalogueSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  country: {
    type: String,
    required: [true, "Please Add a Name"],
  },
  parameter:{
    type:Number,
    required:true
  },
  expert:String,
  source:String,
  thumbnail:String,
  viewCount:{
    type:Number,
    default:0
  },
  commentCount:{
    type:Number,
    default:0
  },
  likeCount:{
    type:Number,
    default:0
  },
},{
  timestamps:true
});


module.exports = mongoose.model("CatalogueSchema", CatalogueSchema, "catalogues");
