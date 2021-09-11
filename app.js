require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Hospital = require("./models/hospital");
const Blog = require("./models/blog");
const Testimonial = require("./models/testimonial");
const Camp = require("./models/camp");
const Auth = require("./routes/auth");
const hospital = require("./routes/hospital");
const admin = require("./routes/admin");
const blog = require("./routes/blog");
const testimonial = require("./routes/testimonial");
const camp = require("./routes/camp");
const {MongoClient} = require("mongodb");
const isNotLoggedIn = require("./middlewares/isNotLoggedIn");
const isLoggedIn = require("./middlewares/isLoggedIn.js");
const verifyToken = require("./middlewares/verifyToken.js");
const moment = require("moment");
const app = express();
require("./passport");

mongoose.connect(process.env.mongoLink, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
	console.log('Connected to DB!')
}).catch(err => {
	console.log('ERROR:', err.message)
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(
  session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    secret: "nishu",
    saveUninitialized: false,
    resave: false,
  })
);

app.use(express.static("./views/assets"));
app.use(express.static("./views/vendor"));
app.use(express.static("./uploads"));

app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next){
	res.locals.nowUser = req.user
	res.locals.isAuth = req.user ? true:false
  next()
})

app.get("/", async (req, res)=>{
    try{
        let blog = await Blog.find({"verified" : true}).sort({_id:-1}).limit(3);
        let testimonial = await Testimonial.find({"verified" : true}).sort({_id:-1}).limit(5);
        const userCount = await User.countDocuments();
        const hospitalCount = await Hospital.countDocuments({"verified" : true});
        const blogCount = await Blog.countDocuments({"verified" : true});
        res.render("landing.ejs", {blog, testimonial, moment, userCount, hospitalCount, blogCount});
    }catch(error){
        res.json({
            success : true,
            message : error.message
        })
    }
})
app.get("/login", isNotLoggedIn, (req, res)=>{
    res.render("login.ejs");
})
app.get("/signup", isNotLoggedIn, (req, res)=>{
    res.render("signup.ejs");
})
app.get("/blog/:id", isLoggedIn, verifyToken, async (req, res)=>{
  try{
    let info = await Blog.findById(req.params.id);
    let user = await User.findById(info.createdBy.id);
    if(!user){
      user = await Hospital.findById(info.createdBy.id);
    }
    res.render("blogs.ejs", {info, user, moment});
  }catch(error){
    res.json({
      success : false,
      message : error.message
    })
  }
})
app.get("/search/blood", isLoggedIn, verifyToken, (req, res)=>{
    res.render("search-blood.ejs")
})

app.get("/blood-bank", isLoggedIn, verifyToken, (req, res)=>{
  res.render("bloodBank.ejs");
})

app.post("/bloodBank/filter", isLoggedIn, verifyToken, async (req, res)=>{
  let hospitals = await Hospital.find({"state" : req.body.state, "city" : req.body.city});
  res.render("bankData.ejs", {hospitals})
})

app.get("/donation-camp", (req, res)=>{
  res.render("donationCamp.ejs");
})

app.get("/logout", isLoggedIn, function (req, res) {
    res.clearCookie("jwt_access_token");
    req.logout();
    res.json({
      success: true,
      message: "Looged out successfully",
    });
  });

app.use("/user", Auth);
app.use("/hospital", hospital);
app.use("/admin", admin);
app.use("/blog", blog);
app.use("/testimonial", testimonial);
app.use("/donation-camp", camp);

app.listen(process.env.PORT || "5000", ()=>{
    console.log("Backend Started ....");
})