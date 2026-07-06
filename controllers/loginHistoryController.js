const db = require("../config/db");
const useragent = require("useragent");

exports.saveLoginHistory = async (req, userId, status) => {

    try {

        const agent = useragent.parse(req.headers["user-agent"]);

        const browser = `${agent.family} ${agent.major || ""}`;
        const os = `${agent.os.family} ${agent.os.major || ""}`;

        const ip =
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress ||
            req.ip;
        console.log("Saving Login History...");
console.log({
    userId,
    browser,
    os,
    ip,
    status
});
        await db.query(
            `INSERT INTO login_history
            (user_id, ip_address, browser, os, login_status)
            VALUES (?,?,?,?,?)`,
            [
                userId,
                ip,
                browser,
                os,
                status
            ]
        );
console.log("✅ Login history saved");
    } catch (err) {

        console.error("Login History Error:", err);

    }

};