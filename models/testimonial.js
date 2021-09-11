const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const Schema   = mongoose.Schema;

// Create a schema
const testimonialSchema = new Schema({
  content : String,
  createdBy : {
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: String
  },
  verified : Boolean,
  createdAt: Date
});
const Testimonial = mongoose.model('testimonial', testimonialSchema);

// Export the model
module.exports = Testimonial;