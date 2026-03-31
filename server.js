const express = require("express");
const app = express();

app.use(express.json());

// 🔐 Twilio
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// 📞 Numbers
const TO_NUMBER = "+919440004658";
const FROM_NUMBER = "+14782238180";

// 🧪 Test route
app.get("/", (req, res) => {
    res.send("🚀 Emergency System is Running!");
});


// 🚨 ALERT API (UPDATED)
app.post("/alert", async (req, res) => {
    console.log("🚨 Emergency received!");

    try {
        // 👉 Get location from ESP32
        const { lat, lng } = req.body;

        // 👉 Google Maps link
        const locationLink = `https://maps.google.com/?q=${lat},${lng}`;

        // 📩 SMS with location
        await client.messages.create({
            body: `🚨 HELP! Emergency detected!\nLocation: ${locationLink}`,
            from: FROM_NUMBER,
            to: TO_NUMBER
        });

        console.log("✅ SMS sent");

        // 📞 Call with custom voice
        await client.calls.create({
            url: `https://emergency-system-5zuw.onrender.com/voice?lat=${lat}&lng=${lng}`, // 👈 CHANGE THIS
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


// 🎤 VOICE MESSAGE (NEW)
app.post("/voice", (req, res) => {

    const lat = req.query.lat;
    const lng = req.query.lng;

    res.type("text/xml");

    res.send(`
        <Response>
            <Say voice="alice">
                I am in emergency. Please help me.
            </Say>
            <Pause length="1"/>
            <Say>
                My location has been sent to your mobile phone.
            </Say>
        </Response>
    `);
});


// 🌐 PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
