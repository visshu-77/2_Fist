const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth_controller");
const user_controller = require("../controllers/user_controller");
const admin_controller = require("../controllers/admin_controller");
const { UserContextImpl } = require("twilio/lib/rest/conversations/v1/user");

router.post("/register",auth_controller.register);
router.post("/login",auth_controller.login);
router.post("/changePassword/:id",user_controller.changePassword);

router.post("/forgotPassword",user_controller.fogotpassword);
router.post("/resetPassword",user_controller.verifyOtpForPasswwordChange);

router.post("/contact_us/:id",admin_controller.contact);
router.post("/addFund/:id",user_controller.addFund);

router.post("/profile/:userId",user_controller.profile);

module.exports  = router;