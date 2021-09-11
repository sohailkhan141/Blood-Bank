const express = require("express");
const router = require("express-promise-router")();
const isNotLoggedIn = require("../middlewares/isNotLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const verifyToken = require("../middlewares/verifyToken.js");
const isAdmin = require("../middlewares/isAdmin");
const User = require("../models/user");
const Hospital = require("../models/hospital");
const Camp = require("../models/camp");
const upload = require("../multer");

router.post(
  "/create",
  isLoggedIn,
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try{
        const info = {
            state : req.body.state,
            poster : req.file ? req.file.filename : "/img/camp.jpg",
            city : req.body.city,
            address : req.body.address,
            content : req.body.content ? req.body.content : "",
            createdBy : {
                id : req.user.id,
                name : req.user.name,
            },
            verified : false,
            openingDate : req.body.openingDate,
            closingDate : req.body.closingDate,
            openingTime : req.body.openingTime.toString(),
            closingTime : req.body.closingTime.toString(),
            createdAt : new Date().getTime()
        }
        await Camp.create(info, function(err, camp){
            if(err){
                console.log(err);
                return res.json({
                    success : false,
                    message : "Error in creating camp"
                })
            }
            res.json({
                success : true,
                message : "Camp created successfully."
            })
        })
    }catch(error){
        res.json({
            success : false,
            message : error.message
        })
    }
  }
);

router.get("/present", async (req, res)=>{
    try{
        let camps = await Camp.find({"verified" : true});
        let ongoingCamp = await camps.filter((data)=>{
            let today = new Date();
            return (data.openingDate<=today)&&(data.closingDate>=today);
        })
        res.render("", {ongoing : ongoingCamp});
    }catch(error){
        res.json({
            success : false,
            message : error.message
        })
    }
})
router.get("/past", async (req, res)=>{
    try{
        let camps = await Camp.find({"verified" : true});
        let pastCamp = await camps.filter((data)=>{
            let today = new Date();
            return data.closingDate<today;
        })
        res.render("", {past : pastCamp});
    }catch(error){
        res.json({
            success : false,
            message : error.message
        })
    }
})
router.get("/future", async (req, res)=>{
    try{
        let camps = await Camp.find({"verified" : true});
        let futureCamp = await camps.filter((data)=>{
            let today = new Date();
            return (data.openingDate>today);
        })
        res.render("", {future : futureCamp});
    }catch(error){
        res.json({
            success : false,
            message : error.message
        })
    }
})

module.exports = router;
