var mongoose = require('mongoose');
var Schema=mongoose.Schema;
module.exports=mongoose.model('User',mongoose.Schema({
  id:String,
  name:String
}));
