const express = require("express");
const app = express();

app.use(express.json());

// Twilio credentials
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

// Numbers
const TO_NUMBER = "+919440004658";
const FROM_NUMBER = "+14782238180";

// 🚨 ALERT API
app.post("/alert", async (req, res) => {
    console.log("🚨 Emergency received!");

    try {
        await client.messages.create({
            body: "🚨 HELP! Emergency detected!",
            from: FROM_NUMBER,
            to: TO_NUMBER
        });

        console.log("✅ SMS sent");

        await client.calls.create({
            url: "https://emergency-system-1.onrender.com/voice",
            to: TO_NUMBER,
            from: FROM_NUMBER
        });

        console.log("✅ Call triggered");

        res.send("✅ Alert sent!");

    } catch (err) {
        console.error("❌ ERROR:", err.message);
        res.status(500).send("❌ Error");
    }
});

// 🎤 VOICE
app.all("/voice", (req, res) => {
    res.type("text/xml");

    res.send(`
        <Response>
            <Say voice="alice">
                I am in emergency. Please help me.
            </Say>
        </Response>
    `);
});

app.listen(3000, () => {
    console.log("🚀 Server running on port 3000");
});
