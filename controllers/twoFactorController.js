const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
// Generate QR Code
exports.setup2FA = async (req, res) => {

    try {

        const userId = req.user.id;

        // Check if user exists and if 2FA is already enabled
        const [users] = await db.query(
            `SELECT two_factor_enabled
             FROM users
             WHERE id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Stop if 2FA is already enabled
        if (users[0].two_factor_enabled) {
            return res.status(400).json({
                success: false,
                message: "Two-Factor Authentication is already enabled."
            });
        }

        // Generate new secret
        const secret = speakeasy.generateSecret({
            name: `SecureAuth-Pro (${userId})`
        });

        // Save secret in database
        await db.query(
            `UPDATE users
             SET two_factor_secret = ?
             WHERE id = ?`,
            [secret.base32, userId]
        );

        // Generate QR Code
        const qrCode = await QRCode.toDataURL(secret.otpauth_url);

        res.json({
            success: true,
            qrCode,
            secret: secret.base32
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
exports.verify2FA = async (req, res) => {

    try {

        const userId = req.user.id;
        const { token } = req.body;

        const [users] = await db.query(
            "SELECT two_factor_secret FROM users WHERE id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const secret = users[0].two_factor_secret;

        const verified = speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token
        });

        if (!verified) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code"
            });
        }

        await db.query(
            "UPDATE users SET two_factor_enabled = TRUE WHERE id = ?",
            [userId]
        );

        res.json({
            success: true,
            message: "2FA Enabled Successfully"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};
const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

exports.login2FA = async (req, res) => {

    try {

        const { userId, token } = req.body;

        if (!userId || !token) {

            return res.status(400).json({
                success: false,
                message: "User ID and OTP are required"
            });

        }

        const [users] = await db.query(
            `SELECT *
             FROM users
             WHERE id = ?`,
            [userId]
        );

        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const user = users[0];

        const verified = speakeasy.totp.verify({

            secret: user.two_factor_secret,

            encoding: "base32",

            token,

            window: 1

        });

        if (!verified) {

            return res.status(401).json({

                success: false,

                message: "Invalid OTP"

            });

        }

        // Remove old refresh tokens

        await db.query(
            "DELETE FROM refresh_tokens WHERE user_id = ?",
            [user.id]
        );

        // Create Access Token

        const accessToken = jwt.sign(

            {
                id: user.id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "15m"
            }

        );

        // Create Refresh Token

        const refreshToken = generateRefreshToken();

        const expiresAt = new Date();

        expiresAt.setDate(expiresAt.getDate() + 7);

        await db.query(

            `INSERT INTO refresh_tokens
            (user_id, token, expires_at)
            VALUES (?, ?, ?)`,

            [
                user.id,
                refreshToken,
                expiresAt
            ]

        );

        // Cookies

        res.cookie("accessToken", accessToken, {

            httpOnly: true,

            sameSite: "Strict",

            secure: false,

            maxAge: 15 * 60 * 1000

        });

        res.cookie("refreshToken", refreshToken, {

            httpOnly: true,

            sameSite: "Strict",

            secure: false,

            maxAge: 7 * 24 * 60 * 60 * 1000

        });

        return res.json({

            success: true,

            message: "Login Successful"

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