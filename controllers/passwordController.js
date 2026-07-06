const crypto = require("crypto");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const transporter = require("../config/mail");

exports.testEmail = async (req, res) => {

    try {

        await transporter.sendMail({

            from: process.env.MAIL_FROM,

            to: process.env.MAIL_USER,

            subject: "SecureAuth-Pro Test",

            html: `
                <h1>🎉 Success!</h1>

                <p>Your email configuration is working correctly.</p>

                <p>SecureAuth-Pro is ready to send password reset emails.</p>
            `

        });

        return res.json({

            success: true,

            message: "Email sent successfully."

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Failed to send email."

        });

    }

};
exports.forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;
       console.log("Forgot Password Email:", email);
        if (!email) {

            return res.status(400).json({
                success: false,
                message: "Email is required"
            });

        }

        const [users] = await db.query(
            "SELECT id, fullname FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Email not found"
            });

        }

        const user = users[0];
        console.log("User Found:", user);
        // Generate Secure Token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Token expires after 15 minutes
        const expiresAt = new Date();

        expiresAt.setMinutes(expiresAt.getMinutes() + 15);

        // Delete previous reset tokens
        await db.query(
            "DELETE FROM password_reset_tokens WHERE user_id = ?",
            [user.id]
        );

        // Save new token
        await db.query(
            `INSERT INTO password_reset_tokens
            (user_id, token, expires_at)
            VALUES (?, ?, ?)`,
            [
                user.id,
                resetToken,
                expiresAt
            ]
        );

        // Reset Link
        const resetLink =
            `http://localhost:3000/reset-password?token=${resetToken}`;

        console.log("Sending reset email...");
console.log(resetLink);
            // Send Email
        await transporter.sendMail({

            from: process.env.MAIL_FROM,

            to: email,

            subject: "SecureAuth-Pro Password Reset",

            html: `
                <h2>Hello ${user.fullname},</h2>

                <p>You requested a password reset.</p>

                <p>
                    <a href="${resetLink}">
                        Click here to reset your password
                    </a>
                </p>

                <p>This link will expire in 15 minutes.</p>

                <p>If you didn't request this, you can safely ignore this email.</p>
            `

        });
console.log("✅ Reset email sent successfully");
        return res.json({

            success: true,

            message: "Password reset email sent."

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};
exports.resetPassword = async (req, res) => {

    try {

        const { token, password } = req.body;

        if (!token || !password) {

            return res.status(400).json({
                success: false,
                message: "Token and password are required"
            });

        }

        const [tokens] = await db.query(
            `SELECT *
             FROM password_reset_tokens
             WHERE token = ?`,
            [token]
        );

        if (tokens.length === 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid reset token"
            });

        }

        const reset = tokens[0];

        // Check if token expired
        if (new Date(reset.expires_at) < new Date()) {

            return res.status(400).json({
                success: false,
                message: "Reset token has expired"
            });

        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update password
        await db.query(
            `UPDATE users
             SET password = ?
             WHERE id = ?`,
            [hashedPassword, reset.user_id]
        );

        // Delete token (one-time use)
        await db.query(
            "DELETE FROM password_reset_tokens WHERE token = ?",
            [token]
        );

        return res.json({

            success: true,

            message: "Password reset successfully"

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};