const express = require("express");
const app = express();
const PORT = 5001;
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv").config();

app.use(cors({
  origin: 'http://localhost:3000',  // フロントエンドのアプリケーションのオリジン
}));


// http://localhost:5001/
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use("/api/v1", require("./src/v1/routes"));



// DB接続
try {
    mongoose.connect(process.env.MONGODB_URL);
    console.log("DBと接続中");
  } catch (error) {
    console.log(error);
  }


app.listen(PORT, () => {
    console.log("ローカルサーバー起動中");
});


