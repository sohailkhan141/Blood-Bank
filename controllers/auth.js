require("dotenv").config();
const JWT = require('jsonwebtoken');
const User = require('../models/user');
const passport = require('passport');

signToken = user => {
  return JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
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
    const foundUser = await User.findOne({ "local.email": email });
    if (foundUser) { 
      return res.status(403).json({ 
          success : false,
          message: 'Email is already in use'
        });
    }

    var hash = await User.hashedPassword(password);
    let newUser;
    // Create a new user
    if(email==="admin@bloodbank.com"){
      newUser = new User({ 
        method: 'local',
        name: name,
        createdAt: new Date().getTime(),
        local: {
          email: email, 
          password: hash
        },
        role: "admin"
      });
    }else{
      newUser = new User({ 
        method: 'local',
        name: name,
        createdAt: new Date().getTime(),
        local: {
          email: email, 
          password: hash
        },
        role: "user"
      });
    }
    await newUser.save();
    passport.authenticate("local", { session: true })(req, res, function(error, user){
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
        res.redirect("/user/edit-profile");
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
    // res.json({
    //     success : true,
    //     method : "local",
    //     message : "You have successfully logged in"
    // })
    // res.redirect("/")
  },

  googleOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    // console.log(req.user);
    // res.status(200).json({ token });
    res.cookie("jwt_access_token", token, {
      // expires: new Date(Date.now() + 300000),
      // secure: true,
      // httpOnly: true,
    });
    res.redirect("/");
  }
}