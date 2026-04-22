const express = require("express");
const app = express();

app.use(express.json());

// 🔐 Twilio credentials from environment variables
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

// Initialize Twilio client
const client = require("twilio")(accountSid, authToken);

// 📞 Phone numbers
const TO_NUMBER = "+919440004658";   // Your verified number
const FROM_NUMBER = "+15187503213";  // Twilio number

// 🧪 Test route (IMPORTANT)
app.get("/", (req, res) => {
    res.send("🚀 Emergency System is Running!");
});

// 🚨 ALERT API
app.post("/alert", async (req, res) => {
    console.log("🚨 Emergency received!");

    try {
        // 📩 Send SMS
        await client.messages.create({
            body: "🚨 HELP! Emergency detected!",
            from: FROM_NUMBER,
            to: TO_NUMBER
        });

        console.log("✅ SMS sent");

        // 📞 Make call
        await client.calls.create({
            url: "https://demo.twilio.com/docs/voice.xml",
            to: TO_NUMBER,
            from: FROM_NUMBER
        });

        console.log("✅ Call triggered");

        res.send("✅ Alert sent successfully!");
    } catch (err) {
        console.error("❌ ERROR:", err.message);
        res.status(500).send("❌ Error sending alert");
    }
});

// 🌐 PORT (Render requirement)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
