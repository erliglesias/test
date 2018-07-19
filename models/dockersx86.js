let mongoose = require('mongoose');

// Article Schema
let Dockersx86Schema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  }
});

let Dockersx86 = module.exports = mongoose.model('Dockersx86', Dockersx86Schema);
