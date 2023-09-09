
const mongoose = require("mongoose");
const CatalogueSchema = new mongoose.Schema({
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
  thumbnail:String
});


module.exports = mongoose.model("CatalogueSchema", CatalogueSchema, "catalogues");
