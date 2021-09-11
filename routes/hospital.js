const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConf = require("../passport");
const isNotLoggedIn = require("../middlewares/isNotLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const verifyToken = require("../middlewares/verifyToken.js");
const hospitalController = require("../controllers/hospital");
const cookieParser = require("cookie-parser");
const passportSignIn = passport.authenticate("Hospital-Strategy", {
  session: true,
});
const passportJWT = passport.authenticate("jwt", { session: false });
const User = require("../models/user");
const Hospital = require("../models/hospital");
const upload = require("../multer");
const { verify } = require("jsonwebtoken");

router.post("/signup", isNotLoggedIn, hospitalController.signUp);

router.post(
  "/signin",
  isNotLoggedIn,
  passportSignIn,
  hospitalController.signIn
);

router.post(
  "/save-profile",
  isLoggedIn,
  verifyToken,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.files);
      let file = req.files;
      let info = await Hospital.findById(req.user.id);
      const details = {
        hospitalType : req.body.hospitalType ? req.body.hospitalType : info.hospitalType,
        photo : file ? (file["photo"] ? file["photo"][0].filename : info.photo) : info.photo,
        document : file ? (file["document"] ? file["document"][0].filename : info.document) : info.document,
        state : req.body.state ? req.body.state : info.state,
        city : req.body.city ? req.body.city : info.city,
        zipcode : req.body.zipcode ? req.body.zipcode : info.zipcode,
        address : req.body.address ? req.body.address : info.address,
        loc : req.body.loc ? req.body.loc : info.loc,
        open : req.body.open ? req.body.open : info.open,
        phone : req.body.phone ? req.body.phone : info.phone
      }

      await Hospital.findByIdAndUpdate(req.user.id, details, async function(err, hospital){
        if(err){
          console.log(err);
          return res.json({
            success : false,
            message : "Error in updating hospital data"
          })
        }
        // await Hospital.createIndex( { "loc" : "2dsphere" } );
        res.json({
          success : true,
          message : "Hospital profile updated successfully"
        })
      })
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.post("/update-bloodUnit", isLoggedIn, verifyToken, async (req, res)=>{
  try{
    let info = await Hospital.findById(req.user.id);
    const details = {
      aPositive : req.body.aPositive ? req.body.aPositive : info.aPositive,
      aNegative : req.body.aNegative ? req.body.aNegative : info.aNegative,
      bPositive : req.body.bPositive ? req.body.bPositive : info.bPositive,
      bNegative : req.body.bNegative ? req.body.bNegative : info.bNegative,
      oPositive : req.body.oPositive ? req.body.oPositive : info.oPositive,
      oNegative : req.body.oNegative ? req.body.oNegative : info.oNegative,
      abPositive : req.body.abPositive ? req.body.abPositive : info.abPositive,
      abNegative : req.body.abNegative ? req.body.abNegative : info.abNegative,
    }
    await Hospital.findByIdAndUpdate(req.user.id, details, function(err, hospital){
      if(err){
        console.log(err);
        return res.json({
          success : false,
          message : "Error in blood Unit updating"
        })
      }
      res.redirect("/")
      res.json({
        success : true,
        message : "Blood Unit updated successfully"
      })
    })
  }catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
})

router.get("/edit-profile", isLoggedIn, verifyToken, async (req, res)=>{
  try{
    let hospital = await Hospital.findById(req.user.id);
    res.render("hospital-profile-edit.ejs", {hospital});
  }catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
})

module.exports = router;
