const router = require("express").Router();
const memoController = require("../controllers/memo");
const tokenHandler = require("../handlers/tokenHandler");

// メモを作成するためのルーター
router.post("/", tokenHandler.verifyToken, memoController.create);

// ログインしているユーザーが投稿したメモを全て取得
router.get("/", tokenHandler.verifyToken, memoController.getAll);
module.exports = router;

// ログインしているユーザーが投稿したメモを一つ取得
router.get("/:memoId", tokenHandler.verifyToken, memoController.getOne);
module.exports = router;

// ログインしているユーザーが投稿したメモを一つ更新
router.put("/:memoId", tokenHandler.verifyToken, memoController.update);
module.exports = router;

// ログインしているユーザーが投稿したメモを一つ削除
router.delete("/:memoId", tokenHandler.verifyToken, memoController.delete);
module.exports = router;