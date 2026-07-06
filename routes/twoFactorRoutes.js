const express = require("express");

const router = express.Router();
console.log("✅ twoFactorRoutes loaded");
const { authenticate } = require("../middleware/auth");
const twoFactorController = require("../controllers/twoFactorController");

// Generate QR Code
router.post(
    "/setup",
    authenticate,
    twoFactorController.setup2FA
);
router.post("/verify", (req, res, next) => {

    console.log("✅ Verify route reached");

    next();

}, authenticate, twoFactorController.verify2FA);
router.post(
    "/login",
    twoFactorController.login2FA
);
module.exports = router;