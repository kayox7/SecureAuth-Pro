require("dotenv").config();

const app = require("./app");
const db = require("./config/db");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await db.query("SELECT 1");

        console.log("✅ Database Connected");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (err) {

        console.error("❌ Database Connection Failed");
        console.error(err);

        process.exit(1);

    }
}

startServer();