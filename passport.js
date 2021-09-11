require("dotenv").config();
const passport                = require('passport');
const JwtStrategy             = require('passport-jwt').Strategy;
const { ExtractJwt }          = require('passport-jwt');
const LocalStrategy           = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-oauth20').Strategy;
const User                    = require('./models/user');
const Hospital                = require('./models/hospital')
const bcrypt                  = require('bcrypt');

passport.serializeUser(function(obj, done){
	if (obj instanceof User) {
        console.log("userrrr");
        // return
         done(null, { id: obj.id, type: "User" });
      } else {
        console.log("hospitalll");
        console.log(obj.id);
        // return
         done(null, { id: obj.id, type: "Hospital" });
      }
})

passport.deserializeUser(async function(obj, done){
	try{
		if (obj.type === "User") {
            console.log("userrrrr222");
            User.findById(obj.id).then((user) => {
              // return 
              done(null, user);
            });
          } else {
            console.log("hospital22222");
            Hospital.findById(obj.id).then((hospital) => {
              // return 
              done(null, hospital);
            });
          }
	}catch(error){
		done(error, null)
	}
})

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // If user doesn't exists, handle it
    if (!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));

// Google OAuth Strategy
passport.use('signupGoogleToken', new GooglePlusTokenStrategy({
  callbackURL: 'https://cipher-mailbot.herokuapp.com/user/oauth/google/redirect',
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  // console.log(profile);
  // return done(null, profile);
  try {
    // Should have full user profile over here
    // console.log('profile', profile);
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    
    const existingUser = await User.findOne({ "google.id": profile.id });
    if (existingUser) {
      return done(error, false, "User with this email already exist");
    }
    const existing = await User.findOne({"local.email": profile.emails[0].value});
    if(existing){
      return done(error, false, "User with this email already exist");
    }

    const newUser = new User({
      method: 'google',
      name: profile.displayName,
      createdAt: new Date().getTime(),
      google: {
        id: profile.id,
        email: profile.emails[0].value
      },
      role: "user"
    });
    await newUser.save();
    done(null, newUser);
  } catch(error) {
    done(error, false, error.message);
  }
}));

passport.use('signinGoogleToken', new GooglePlusTokenStrategy({
  callbackURL: 'https://cipher-mailbot.herokuapp.com/user/oauth/google/redirect',
  clientID: process.env.clientID,
  clientSecret: process.env.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  // console.log(profile);
  // return done(null, profile);
  try {
    // Should have full user profile over here
    // console.log('profile', profile);
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    
    const existingUser = await User.findOne({ "google.id": profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    const existing = await User.findOne({"local.email": profile.emails[0].value});
    if(existing){
      return done(error, false, "You have not linked your this google account with this webiste, please use another way.");
    }
    if(!existingUser){
      return done(error, false, "No user with this email. Please signup");
    }
  } catch(error) {
    done(error, false, error.message);
  }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ "local.email": email });
    
    // If not, handle it
    if (!user) {
      console.log("err1");
      return done(null, false);
    }
  
    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.local.password);;
  
    // If not, handle it
    if (!isMatch) {
    //   console.log(user.local.password);
      console.log("err2");
      return done(null, false);
    }
  
    // Otherwise, return the user
    done(null, user);
  } catch(error) {
    console.log("err3");
    done(error, false);
  }
}));

passport.use("Hospital-Strategy",new LocalStrategy({
    usernameField: 'email'
  }, async (email, password, done) => {
    try {
      // Find the user given the email
      const hospital = await Hospital.findOne({ "local.email": email });
      
      // If not, handle it
      if (!hospital) {
        console.log("Hospital with given email Not Found");
        return done(null, false);
      }
    
      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, hospital.local.password);;
    
      // If not, handle it
      if (!isMatch) {
      //   console.log(user.local.password);
        console.log("password didn't match");
        return done(null, false);
      }
    
      // Otherwise, return the user
      done(null, hospital);
    } catch(error) {
      console.log("err3");
      done(error, false);
    }
  }));