const express = require("express");
const router = require("express-promise-router")();
const isNotLoggedIn = require("../middlewares/isNotLoggedIn");
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const verifyToken = require("../middlewares/verifyToken.js");
const isAdmin = require("../middlewares/isAdmin");
const User = require("../models/user");
const Hospital = require("../models/hospital");
const Testimonial = require("../models/testimonial");
const Blog = require("../models/blog");

router.get(
  "/hospital-verify/:id",
  isLoggedIn,
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      await Hospital.findByIdAndUpdate(
        req.params.id,
        { verified: true },
        function (err, hospital) {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: "Error on hospital verification.",
            });
          }
          res.json({
            success: true,
            message: "Hospital verified successfully.",
          });
        }
      );
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }
);
router.get(
  "/blog-verify/:id",
  isLoggedIn,
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      await Blog.findByIdAndUpdate(
        req.params.id,
        { verified: true },
        function (err, blog) {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: "Error on blog verification.",
            });
          }
          res.json({
            success: true,
            message: "Blog verified successfully.",
          });
        }
      );
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }
);
router.get(
  "/testimonial-verify/:id",
  isLoggedIn,
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      await Testimonial.findByIdAndUpdate(
        req.params.id,
        { verified: true },
        function (err, testimonial) {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: "Error on testimonial verification.",
            });
          }
          res.json({
            success: true,
            message: "testimonial verified successfully.",
          });
        }
      );
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }
);
router.get(
  "/camp-verify/:id",
  isLoggedIn,
  verifyToken,
  isAdmin,
  async (req, res) => {
    try {
      await Camp.findByIdAndUpdate(
        req.params.id,
        { verified: true },
        function (err, camp) {
          if (err) {
            console.log(err);
            return res.json({
              success: false,
              message: "Error on camp verification.",
            });
          }
          res.json({
            success: true,
            message: "Camp verified successfully.",
          });
        }
      );
    } catch (error) {
      res.json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
