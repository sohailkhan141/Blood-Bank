const passport = require('passport');

function isAdmin(req, res, next) {
    if (!req.user) {
      // req.session = null;
      res.json({
          success : false,
          message : "Please LogIn first."
      });
    } else {
        if(req.user.role==="user"){
            res.json({
                success : false,
                message : "You don't have admin access."
            });
        }else{
            next();
        }
    }
  } 

  module.exports = isAdmin;