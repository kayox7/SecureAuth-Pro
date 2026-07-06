require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const twoFactorRoutes = require("./routes/twoFactorRoutes");
const passwordRoutes = require("./routes/passwordRoutes");
const app = express();

// Security middleware
app.use(helmet());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {

    res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, private"
    );

    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    next();

});
// Health check
app.get("/", (req, res) => {
    res.json({
        status: "OK",
        message: "SecureAuth-Pro API is running"
    });
});

app.use(express.static("public"));

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/views/login.html");
});

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/views/register.html");
});

app.get("/dashboard", (req, res) => {
    res.sendFile(__dirname + "/views/dashboard.html");
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/views/admin.html");
});
app.get("/reset-password", (req, res) => {

    res.sendFile(__dirname + "/views/reset-password.html");

});
app.get("/change-password", (req, res) => {

    res.sendFile(__dirname + "/views/changePassword.html");

});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/2fa", twoFactorRoutes);
app.use("/api/password", passwordRoutes);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

module.exports = app;