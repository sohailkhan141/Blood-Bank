const express = require("express");
const router = require("express-promise-router")();
const isNotLoggedIn = require("../middlewares/isNotLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const verifyToken = require("../middlewares/verifyToken.js");
const isAdmin = require("../middlewares/isAdmin");
const User = require("../models/user");
const Hospital = require("../models/hospital");
const Testimonial = require("../models/testimonial");

router.post(
  "/submit",
  isLoggedIn,
  verifyToken,
  async (req, res) => {
    try{
        const info = {
            content : req.body.content,
            createdBy : {
                id : req.user.id,
                name : req.user.name
            },
            verified : false,
            createdAt : new Date().getTime()
        }
        await Testimonial.create(info, function(err, testimonial){
            if(err){
                console.log(err);
                return res.json({
                    success : false,
                    message : "Error in creating testimonial"
                })
            }
            res.redirect("/")
            // res.json({
            //     success : true,
            //     message : "Testimonial created successfully."
            // })
        })
    }catch(error){
        res.json({
            success : false,
            message : error.message
        })
    }
  }
);

router.get("/write", isLoggedIn, verifyToken, (req, res)=>{
    res.render("testimonial.ejs")
})

module.exports = router;
