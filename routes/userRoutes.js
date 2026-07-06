const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth");
const db = require("../config/db");

router.get("/dashboard", authenticate, async (req, res) => {

    try {

      const [users] = await db.query(
    `SELECT
        id,
        fullname,
        email,
        role,
        two_factor_enabled
     FROM users
     WHERE id = ?`,
    [req.user.id]
);
        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        res.json({

            success: true,

            user: users[0]

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});
router.get(
    "/login-history",
    authenticate,
    async (req, res) => {

        try {

            const [history] = await db.query(

                `SELECT
                    browser,
                    os,
                    ip_address,
                    login_status,
                    login_time
                 FROM login_history
                 WHERE user_id = ?
                 ORDER BY login_time DESC
                 LIMIT 5`,

                [req.user.id]

            );

            res.json({

                success: true,

                history

            });

        } catch (err) {

            console.error(err);

            res.status(500).json({

                success: false,

                message: "Server Error"

            });

        }

    }
);
module.exports = router;