const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const Schema   = mongoose.Schema;

// Create a schema
const hospitalSchema = new Schema({
  method: {
    type: String,
    enum: ['local'],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: { 
      type: String
    }
  },
  name: String,
  hospitalType: {
    type : String,
    default : null
  },
  phone : {
    type : String,
    default : null
  },
  photo: {
    type : String,
    default : "/img/dummy.jpeg"
  },
  document : {
    type : String,
    default : null
  },
  state: {
    type : String,
    default : null
  },
  city: {
    type : String,
    default : null
  },
  zipcode: {
    type : String,
    default : null
  },
  address: {
    type : String,
    default : null
  },
  loc: JSON,
  open : {
    type : Boolean,
    default : false
  },
  verified : {
    type : Boolean,
    default : false
  },
  aPositive : {
    type : Number,
    default : 0
  },
  aNegative : {
    type : Number,
    default : 0
  },
  bPositive : {
    type : Number,
    default : 0
  },
  bNegative : {
    type : Number,
    default : 0
  },
  oPositive : {
    type : Number,
    default : 0
  },
  oNegative : {
    type : Number,
    default : 0
  },
  abPositive : {
    type : Number,
    default : 0
  },
  abNegative : {
    type : Number,
    default : 0
  },
  createdAt: Date
});
const Hospital = mongoose.model('hospital', hospitalSchema);

// Export the model
module.exports = Hospital;
module.exports.hashedPassword = async function(password){
  try {
    console.log('entered');
    // Generate a salt
    const saltRounds = 10;
    // Generate a password hash (salt + hash)
    return await bcrypt.hash(password, saltRounds);
    // Re-assign hashed version over original, plain text password
  } catch(error) {
      throw new Error('hashing failed', error)
  }
};