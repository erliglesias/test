let mongoose = require('mongoose');

// Client Schema
let clientSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  ip:{
    type: String,
    required: true
  },
  usename:{
    type: String,
    required: true
  },
  psw:{
    type: String,
    required: true
  }
});

let Client = module.exports = mongoose.model('Client', clientSchema);
