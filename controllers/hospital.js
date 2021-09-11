require("dotenv").config();
const JWT = require('jsonwebtoken');
const Hospital = require('../models/hospital');
const passport = require('passport');

signToken = hospital => {
  return JWT.sign({ id: hospital._id }, process.env.JWT_SECRET, {
    expiresIn: new Date().setDate(new Date().getDate() + 1) // expires in 24 hours
  });
}

module.exports = {
  signUp: async (req, res, next) => {
    const {name, email, password } = req.body;

    // // Check if there is a user with the same email
    // console.log(name);
    // console.log(email);
    // console.log(password);
    const foundHospital = await Hospital.findOne({ "local.email": email });
    if (foundHospital) { 
      return res.status(403).json({ 
          success : false,
          message: 'Email is already in use'
        });
    }

    var hash = await Hospital.hashedPassword(password);

    // Create a new user
    const newHospital = new Hospital({ 
      method: 'local',
      name: name,
      createdAt: new Date().getTime(),
      local: {
        email: email, 
        password: hash
      },
      verified : false
    });
    await newHospital.save();
    passport.authenticate("Hospital-Strategy", { session: true })(req, res, function(error, hospital){
        if(error){
            console.log(error);
            return ;
        }
        const token = signToken(req.user);
        res.cookie("jwt_access_token", token, {
        // expires: new Date(Date.now() + 300000),
        // secure: true,
        // httpOnly: true,
        });
        console.log(req.user);
        console.log(req.session);
        res.redirect("/hospital/profile-edit");
        res.json({
            success : true,
            method : "local",
            message : "You have successfully signed up"
        })
    })
    // res.redirect("/users/signin");
  },

  signIn: async (req, res, next) => {
    // Generate token
    // console.log(req.user)
    const token = signToken(req.user);
    res.cookie("jwt_access_token", token, {
      // expires: new Date(Date.now() + 300000),
      // secure: true,
      // httpOnly: true,
    });
    console.log(req.session);
    res.redirect("/");
    res.json({
        success : true,
        method : "local",
        message : "You have successfully logged in"
    })
    // res.redirect("/")
  }

}