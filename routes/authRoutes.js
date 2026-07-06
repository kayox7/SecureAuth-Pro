const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const { loginLimiter } = require("../middleware/rateLimiter");

const {
    registerValidation,
    loginValidation,
    validate
} = require("../validators/authValidator");

// Register
router.post(
    "/register",
    registerValidation,
    validate,
    authController.register
);

// Login
router.post(
    "/login",
    loginLimiter,
    loginValidation,
    validate,
    authController.login
);

// Refresh Token
router.post(
    "/refresh-token",
    authController.refreshToken
);

// Logout
router.post(
    "/logout",
    authController.logout
);
// Verify Email
router.get(
    "/verify-email",
    authController.verifyEmail
);
const { authenticate } = require("../middleware/auth");

router.post(
    "/change-password",
    authenticate,
    authController.changePassword
);
router.post(
    "/logout-all",
    authenticate,
    authController.logoutAllDevices
);
router.post(
    "/resend-verification",
    authController.resendVerificationEmail
);
module.exports = router;