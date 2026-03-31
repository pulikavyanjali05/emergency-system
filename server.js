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

// 📍 Store mobile location
let latestLocation = { lat: null, lng: null };

// 🧪 Test route
app.get("/", (req, res) => {
    res.send("🚀 Emergency System is Running!");
});


// 📍 MOBILE → SEND LOCATION
app.post("/location", (req, res) => {
    const { lat, lng } = req.body;

    latestLocation = { lat, lng };

    console.log("📍 Mobile Location:", lat, lng);

    res.send("✅ Location received");
});


// 🚨 ESP32 → ALERT TRIGGER
app.post("/alert", async (req, res) => {
    console.log("🚨 Emergency triggered!");

    try {

        // ⏳ Wait for mobile location
        setTimeout(async () => {

            if (latestLocation.lat && latestLocation.lng) {

                const locationLink = `https://maps.google.com/?q=${latestLocation.lat},${latestLocation.lng}`;

                // 📩 SMS
                await client.messages.create({
                    body: `🚨 HELP! Emergency!\nLocation: ${locationLink}`,
                    from: FROM_NUMBER,
                    to: TO_NUMBER
                });

                console.log("✅ SMS sent");

                // 📞 Call
                await client.calls.create({
                    url: "https://emergency-system-5zuw.onrender.com/voice",
                    to: TO_NUMBER,
                    from: FROM_NUMBER
                });

                console.log("✅ Call triggered");

            } else {
                console.log("❌ No location received from mobile");
            }

        }, 5000); // wait 5 sec

        res.send("✅ Alert received");

    } catch (err) {
        console.error("❌ ERROR:", err.message);
        res.status(500).send("Error");
    }
});


// 🎤 VOICE MESSAGE
app.all("/voice", (req, res) => {
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
