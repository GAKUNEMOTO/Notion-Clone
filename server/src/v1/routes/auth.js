const router = require("express").Router();
const { body } = require("express-validator");
const User = require("../models/user");
const validation = require("../handlers/validation")
const userController = require("../controllers/user");
const tokenHandler = require("../handlers/tokenHandler");
require("dotenv").config();



router.post("/register", [
    // Validation checks
    body("username")
      .isLength({ min: 8 })
      .withMessage("ユーザー名は８文字以上である必要があります"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("パスワードは８文字以上である必要があります"),
    body("confirmPassword")
      .isLength({ min: 8 })
      .withMessage("確認パスワードは８文字以上である必要があります"),
    body("username")
      .custom((value) => {
        // Check for duplicate username
        return User.findOne({ username: value }).then((user) => {
          if (user) {
            return Promise.reject("このユーザーはすでに使われています");
          }
        });
      }),
    // Validation error handling
    validation.validates,
  ], (req, res) => {
    // User registration logic
    userController.register(req, res);
  });
  
// ログイン用API
router.post("/login",
 body("username")
    .isLength({min:8}).withMessage("ユーザー名は８文字以上である必要があります"), 
 body("password")
    .isLength({min:8}).withMessage("パスワードは８文字以上である必要があります"),
    validation.validates,
    userController.login
);

//JWTAPI認証
router.post("/verify-token",tokenHandler.verifyToken, (req,res) => {
    return res.status(200).json({user: req.user});

})


module.exports = router;