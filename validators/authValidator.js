const { body, validationResult } = require("express-validator");

// Validation Rules
const registerValidation = [
    body("fullname")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password must contain one special character")
];

const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
];

// Validation Error Handler
const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            success: false,
            errors: errors.array()
        });

    }

    next();
};

module.exports = {
    registerValidation,
    loginValidation,
    validate
};