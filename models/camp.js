const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const Schema   = mongoose.Schema;

// Create a schema
const campSchema = new Schema({
  state: String,
  poster : {
    type : String,
    default : "/img/camp.jpg"
  },
  city : String,
  address : String,
  content : String,
  createdBy : {
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital"
    },
    name: String,
  },
  verified : Boolean,
  openingDate : Date,
  closingDate : Date,
  openingTime : String,
  closingTime : String,
  createdAt: Date
});
const Camp = mongoose.model('camp', campSchema);

// Export the model
module.exports = Camp;