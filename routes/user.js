const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const { upload } = require("../middleware/multer");

router.post("/user/signup", upload.single("imgUrl"), userCtrl.signup);
router.post("/user/login", userCtrl.login);
router.post("user/logout", userCtrl.logout);
router.get("/user", userCtrl.getUser);
router.get("/user/:id", userCtrl.getOneUser);
router.get("/user/:id/order",userCtrl.getOrderByUser)
router.put("/user/:id", userCtrl.modifyUser);
router.delete("/user/:id", userCtrl.deleteUser);

module.exports = router;
