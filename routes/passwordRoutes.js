const express = require("express");

const router = express.Router();

const passwordController = require("../controllers/passwordController");

router.get(
    "/test-email", 
    passwordController.testEmail
);

router.post(
    "/forgot",
    passwordController.forgotPassword
);
router.post(
    "/reset",
    passwordController.resetPassword
);
module.exports = router;