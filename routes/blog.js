const express = require("express");
const router = require("express-promise-router")();
const isNotLoggedIn = require("../middlewares/isNotLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const verifyToken = require("../middlewares/verifyToken.js");
const isAdmin = require("../middlewares/isAdmin");
const User = require("../models/user");
const Hospital = require("../models/hospital");
const Blog = require("../models/blog");
const upload = require("../multer");

router.post(
  "/submit",
  isLoggedIn,
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try{
        const info = {
            title : req.body.title,
            poster : req.file ? req.file.filename : "/img/blog.png",
            content : req.body.editor1,
            createdBy : {
                id : req.user.id,
                name : req.user.name,
            },
            verified : false,
            createdAt : new Date().getTime()
        }
        await Blog.create(info, function(err, blog){
            if(err){
                console.log(err);
                return res.json({
                    success : false,
                    message : "Error in creating blog"
                })
            }
            res.redirect("/");
            // res.json({
            //     success : true,
            //     message : "Blog created successfully."
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

router.get("/post/write", isLoggedIn, verifyToken, (req, res)=>{
    res.render("writeBlog.ejs");
})

module.exports = router;
