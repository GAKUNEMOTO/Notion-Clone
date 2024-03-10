const CryptoJS = require("crypto-js");
const JWT = require("jsonwebtoken");
const User = require("../models/user");

exports.register = async(req,res) => {
    // パスワードの受け取り
    const password = req.body.password;

    try{
        // パスワードの暗号化
        const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
        // ユーザーの新規作成
        const user = await User.create({
            username: req.body.username,
            password: encryptedPassword,
        });
        // JWTの発行
        const token = JWT.sign({id:user._id}, process.env.TOKEN_SECRET_KEY,{
            expiresIn:"24h",
        });
        return res.status(200).json({ user, token });
    
    } catch(error){
        return res.status(500).json(error);
    }
};

// ログイン用API
exports.login = async (req,res) => {
    const {username, password} = req.body;

    try{
        // DBからユーザーが存在しているか探してくる
        const user = await User.findOne({username: username})
        if(!user) {
            return res.status(401).json({
                errors : [{
                    path:"username",
                    msg: "ユーザーが無効です"
                }
            ]
         })
    }

        // パスワードがあっているか確認する
        const decryptedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);

        if(decryptedPassword !== password){
           return res.status(401).json({
                errors:[{
                    path : "password",
                    msg: "パスワードが無効です"
                }
            ]
            })
        }

         // JWTの発行
         const token = JWT.sign({id:user._id}, process.env.TOKEN_SECRET_KEY,{
            expiresIn:"24h",
        });

        return res.status(201).json({user,token});

    }catch(err){
        return res.status(500).json(err);
    }
};