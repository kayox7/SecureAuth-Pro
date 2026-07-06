const express = require("express");

const router = express.Router();

const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");

router.get(
    "/dashboard",
    authenticate,
    authorize("admin"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome Admin",
            user: req.user
        });
    }
);

module.exports = router;