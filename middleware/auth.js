const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {

    try {

        let token = null;

        // Read Access Token from Cookie
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        // Fallback for Thunder Client
        if (!token && req.headers.authorization) {

            const authHeader = req.headers.authorization;

            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }

};

module.exports = {
    authenticate
};