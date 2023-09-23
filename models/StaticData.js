
const mongoose = require("mongoose");
const StaticDataSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   type:{
    type:String,
    enum:['parameter','country','service']
   }
},{
  timestamps:true
});


module.exports = mongoose.model("StaticDataSchema", StaticDataSchema, "staticdatas");
