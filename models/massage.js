var mongoose = require('mongoose');
var Schema=mongoose.Schema;
module.exports=mongoose.model('Massage',mongoose.Schema({
  tag:String,
  text:String,
  owner:String
}));
