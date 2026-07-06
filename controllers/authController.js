const bcrypt = require("bcrypt");
const db = require("../config/db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("../config/mail");
const useragent = require("useragent");
const loginHistory = require("./loginHistoryController");
const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};
exports.register = async (req, res) => {

    try {

        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!passwordRegex.test(password)) {

    return res.status(400).json({

        success: false,

        message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."

    });

}
        const [existing] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        await db.query(
    `INSERT INTO users
    (
        fullname,
        email,
        password,
        email_verification_token
    )
    VALUES(?,?,?,?)`,
    [
        fullname,
        email,
        hashedPassword,
        verificationToken
    ]
);
const verificationLink =
`http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;
console.log("Verification Token:", verificationToken);
console.log("Verification Link:", verificationLink);
console.log("Sending email to:", email);
await transporter.sendMail({

    from: process.env.MAIL_FROM,

    to: email,

    subject: "Verify your SecureAuth-Pro account",

    html: `

        <h2>Welcome to SecureAuth-Pro</h2>

        <p>Hi ${fullname},</p>

        <p>Thank you for registering.</p>

        <p>Please click the button below to verify your email.</p>

        <a href="${verificationLink}"
           style="
                background:#2563eb;
                color:white;
                padding:12px 20px;
                text-decoration:none;
                border-radius:6px;
                display:inline-block;
           ">
            Verify Email
        </a>

        <p>This link can only be used once.</p>

    `

});
console.log("✅ Verification email sent successfully");
        return res.status(201).json({

    success: true,

    message: "Registration successful. Please verify your email."

});

   } catch (err) {

    console.error("Registration Error:");
    console.error(err);

    return res.status(500).json({
        success: false,
        message: err.message
    });


   }
}
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            await loginHistory.saveLoginHistory(
    req,
    null,
    "FAILED"
);

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }

        const user = users[0];
        // Check if account is locked
if (user.lock_until && new Date(user.lock_until) > new Date()) {

    return res.status(403).json({

        success: false,

        message: "Your account is locked. Please try again in 15 minutes."

    });

}
if (!user.email_verified) {

    return res.status(403).json({

        success: false,

        message: "Please verify your email before logging in."

    });

}
        const validPassword = await bcrypt.compare(
            password,
            user.password
        );
if (!validPassword) {
console.log("❌ Wrong password");
    let attempts = user.failed_attempts + 1;
   console.log("Current Attempts:", user.failed_attempts);
console.log("New Attempts:", attempts);
    if (attempts >= 5) {

        const lockUntil = new Date();

        lockUntil.setMinutes(lockUntil.getMinutes() + 15);

        await db.query(

            `UPDATE users
             SET failed_attempts = 5,
                 lock_until = ?
             WHERE id = ?`,

            [
                lockUntil,
                user.id
            ]

        );

        return res.status(403).json({

            success: false,

            message: "Too many failed attempts. Account locked for 15 minutes."

        });

    }

    await db.query(

        `UPDATE users
         SET failed_attempts = ?
         WHERE id = ?`,

        [
            attempts,
            user.id
        ]

    );
    const [check] = await db.query(
    "SELECT failed_attempts FROM users WHERE id = ?",
    [user.id]
);

console.log("Database value:", check[0].failed_attempts);
console.log("Database updated.");
    await loginHistory.saveLoginHistory(
        req,
        user.id,
        "FAILED"
    );

    return res.status(401).json({

        success: false,

        message: `Invalid password. ${5 - attempts} attempts remaining.`

    });

}

        // Access Token (15 minutes)
        // Check if 2FA is enabled
        if (user.two_factor_enabled) {

       return res.json({
       success: true,
       requires2FA: true,
       userId: user.id,
       email: user.email,
       message: "Two-Factor Authentication Required"
            });
        }
     await db.query(

    `UPDATE users
     SET failed_attempts = 0,
         lock_until = NULL
     WHERE id = ?`,

    [user.id]

);   
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
        await db.query(
        "DELETE FROM refresh_tokens WHERE user_id = ?",
         [user.id]
           );
        // Refresh Token

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
        await loginHistory.saveLoginHistory(
    req,
    user.id,
    "SUCCESS"
);
const agent = useragent.parse(req.headers["user-agent"]);

const browser =
`${agent.family} ${agent.major || ""}`;

const os =
`${agent.os.family} ${agent.os.major || ""}`;

const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    req.ip;

await transporter.sendMail({

    from: process.env.MAIL_FROM,

    to: user.email,

    subject: "🔐 New Login Detected - SecureAuth-Pro",

    html: `

        <h2>New Login Detected</h2>

        <p>Hello <b>${user.fullname}</b>,</p>

        <p>Your account has just logged in successfully.</p>

        <table border="1" cellpadding="10" cellspacing="0">

            <tr>
                <td><b>Time</b></td>
                <td>${new Date().toLocaleString()}</td>
            </tr>

            <tr>
                <td><b>IP Address</b></td>
                <td>${ip}</td>
            </tr>

            <tr>
                <td><b>Browser</b></td>
                <td>${browser}</td>
            </tr>
             
             <tr>
        <td><b>Operating System</b></td>
        <td>${os}</td>
    </tr>
        </table>

        <br>

        <p>If this login was you, you can ignore this email.</p>

        <p>If you don't recognize this login, change your password immediately.</p>

        <hr>

        <small>SecureAuth-Pro Security Team</small>

    `

});

        return res.json({

            success: true,

            message: "Login successful",

            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
exports.refreshToken = async (req, res) => {

    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token missing"
            });
        }

        const [rows] = await db.query(
            `SELECT * FROM refresh_tokens
             WHERE token = ?`,
            [refreshToken]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        const storedToken = rows[0];

        if (new Date(storedToken.expires_at) < new Date()) {
            return res.status(401).json({
                success: false,
                message: "Refresh token expired"
            });
        }

        const [users] = await db.query(
            "SELECT id, role FROM users WHERE id = ?",
            [storedToken.user_id]
        );

        const user = users[0];

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

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "Strict",
            secure: false,
            maxAge: 15 * 60 * 1000
        });

        return res.json({
            success: true,
            message: "Access token refreshed"
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
exports.logout = async (req, res) => {

    try {
          console.log("Cookies:", req.cookies);

        console.log("Refresh Token:", req.cookies.refreshToken);
        const refreshToken = req.cookies.refreshToken;

     if (refreshToken) {

    const [result] = await db.query(
        "DELETE FROM refresh_tokens WHERE token = ?",
        [refreshToken]
    );

    console.log("Deleted rows:", result.affectedRows);

}

        res.clearCookie("accessToken");

        res.clearCookie("refreshToken");

        return res.json({

            success: true,

            message: "Logged out successfully"

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};
exports.verifyEmail = async (req, res) => {

    try {

        const { token } = req.query;

        if (!token) {
            return res.status(400).send("Verification token missing.");
        }

        const [users] = await db.query(
            `SELECT id
             FROM users
             WHERE email_verification_token = ?`,
            [token]
        );

        if (users.length === 0) {
            return res.status(400).send("Invalid verification link.");
        }

        await db.query(
            `UPDATE users
             SET email_verified = TRUE,
                 email_verification_token = NULL
             WHERE id = ?`,
            [users[0].id]
        );

        res.send(`
            <h2>✅ Email Verified Successfully</h2>
            <p>Your account has been verified.</p>
            <a href="/login">Go to Login</a>
        `);

    } catch (err) {

        console.error(err);

        res.status(500).send("Server Error");

    }

};
exports.changePassword = async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        if (newPassword !== confirmPassword) {

            return res.status(400).json({
                success: false,
                message: "New passwords do not match."
            });

        }
        const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!passwordRegex.test(newPassword)) {

    return res.status(400).json({

        success: false,

        message: "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."

    });

}
        const [users] = await db.query(
            "SELECT password FROM users WHERE id = ?",
            [req.user.id]
        );

        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }

        const user = users[0];

        const validPassword = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!validPassword) {

            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });

        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            12
        );

        await db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, req.user.id]
        );

        // Logout from all devices
        await db.query(
            "DELETE FROM refresh_tokens WHERE user_id = ?",
            [req.user.id]
        );

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.json({

            success: true,

            message: "Password changed successfully. Please login again."

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};
exports.logoutAllDevices = async (req, res) => {

    try {

        await db.query(

            "DELETE FROM refresh_tokens WHERE user_id = ?",

            [req.user.id]

        );

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.json({

            success: true,

            message: "Logged out from all devices successfully."

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};
exports.resendVerificationEmail = async (req, res) => {

    try {

        const { email } = req.body;

        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Email not found."
            });

        }

        const user = users[0];

        if (user.email_verified) {

            return res.json({
                success: false,
                message: "Email is already verified."
            });

        }

        const verificationToken = crypto.randomBytes(32).toString("hex");

        await db.query(

            `UPDATE users
             SET email_verification_token = ?
             WHERE id = ?`,

            [
                verificationToken,
                user.id
            ]

        );

        const verificationLink =
        `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;

        await transporter.sendMail({

            from: process.env.MAIL_FROM,

            to: user.email,

            subject: "Verify your SecureAuth-Pro account",

            html: `
                <h2>Email Verification</h2>

                <p>Hello ${user.fullname},</p>

                <p>Please verify your email.</p>

                <a href="${verificationLink}">
                    Verify Email
                </a>
            `

        });

        return res.json({

            success: true,

            message: "Verification email sent successfully."

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

};