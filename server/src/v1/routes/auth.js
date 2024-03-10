const router = require("express").Router();
const { body } = require("express-validator");
const User = require("../models/user");
const validation = require("../handlers/validation")
const userController = require("../controllers/user");
const tokenHandler = require("../handlers/tokenHandler");
require("dotenv").config();



// ユーザー新規登録 
router.post("/register", 
// バリデーションチェック
body("username")
    .isLength({min:8})
    .withMessage("ユーザー名は８文字以上である必要があります"),
body("password")
    .isLength({min:8})
    .withMessage("パスワードは８文字以上である必要があります"),
body("confirmPassword")
    .isLength({min:8})
    .withMessage("確認パスワードは８文字以上である必要があります"),
body("username").custom((value) => {
    return User.findOne({username: value}).then((user) => {
        if(user) {
            return Promise.reject("このユーザーはすでに使われています");
        }
    });
    
}),
// バリデーションのエラーを出力する機能
validation.validates,
userController.register
);

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