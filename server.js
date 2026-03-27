const express = require("express");
const app = express();

app.use(express.json());

// Twilio
const accountSid = "ACefb22728606d39506ac109aeaa2401cc";
const authToken = "f32ad29ed0fa679cd892defa502dacbf";
const client = require("twilio")(accountSid, authToken);

const TO_NUMBER = "+919440004658";
const FROM_NUMBER = "+14782238180";

// API
app.post("/alert", async (req, res) => {
    console.log("🚨 Emergency received!");

    try {
        await client.messages.create({
            body: "🚨 HELP! Emergency detected!",
            from: FROM_NUMBER,
            to: TO_NUMBER
        });

        await client.calls.create({
            url: "http://demo.twilio.com/docs/voice.xml",
            to: TO_NUMBER,
            from: FROM_NUMBER
        });

        res.send("Alert sent!");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
});

// PORT FIX (important for :contentReference[oaicite:0]{index=0})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
