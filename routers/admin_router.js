const express = require("express");
const router = express();
const admin_controller = require("../controllers/admin_controller");

router.get("/showUser",admin_controller.showUser);
router.post("/block/:id",admin_controller.blockUser);

module.exports = router;