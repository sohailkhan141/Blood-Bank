const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConf = require("../passport");
const isNotLoggedIn = require("../middlewares/isNotLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const verifyToken = require("../middlewares/verifyToken.js");
const authController = require("../controllers/auth");
const cookieParser = require("cookie-parser");
const passportSignIn = passport.authenticate("local", { session: true });
const passportJWT = passport.authenticate("jwt", { session: false });
const User = require("../models/user");
const upload = require("../multer");

router.post("/signup", isNotLoggedIn, authController.signUp);

router.post("/signin", isNotLoggedIn, passportSignIn, authController.signIn);

router.get(
  "/oauth/google/signup",
  isNotLoggedIn,
  passport.authenticate("signupGoogleToken", { scope: ["profile", "email"] })
);

router.get(
  "/oauth/google/signin",
  isNotLoggedIn,
  passport.authenticate("signinGoogleToken", { scope: ["profile", "email"] })
);

router.get(
  "/oauth/google/redirect",
  isNotLoggedIn,
  passport.authenticate("googleToken", { failureRedirect: "" }),
  authController.googleOAuth
);

router.post(
  "/save-profile",
  isLoggedIn,
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      let info = await User.findById(req.user.id);
      const details = {
        phone: req.body.phone ? req.body.phone : info.phone,
        photo: req.file ? req.file.filename : info.photo,
        bloodGroup: req.body.bloodGroup ? req.body.bloodGroup : info.bloodGroup,
        state: req.body.state ? req.body.state : info.state,
        city: req.body.city ? req.body.city : info.city,
        zipcode: req.body.zipcode ? req.body.zipcode : info.zipcode,
        address: req.body.address ? req.body.address : info.address,
      };

      await User.findByIdAndUpdate(req.user.id, details, function (err, user) {
        if (err) {
          console.log(err);
          return;
        }
        res.redirect("/");
      });
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.get("/profile", async (req, res)=>{
  try{
    let user = await User.findById(req.user.id);
    res.render("user-pro.ejs", {user});
  }catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
})

router.get("/edit-profile", isLoggedIn, verifyToken, async (req, res) => {
  try {
    let user = await User.findById(req.user.id);
    res.render("user-pro-edit.ejs", { user });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
