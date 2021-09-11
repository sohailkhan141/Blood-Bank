const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');
const Schema   = mongoose.Schema;

// Create a schema
const blogSchema = new Schema({
  title: String,
  poster : String,
  content : String,
  createdBy : {
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: String,
  },
  verified : Boolean,
  createdAt: Date
});
const Blog = mongoose.model('blog', blogSchema);

// Export the model
module.exports = Blog;