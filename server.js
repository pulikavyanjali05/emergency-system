const express = require("express");
const app = express();
app.use(express.json());

// Twilio credentials
const accountSid = "ACefb22728606d39506ac109aeaa2401cc";
const authToken = "f32ad29ed0fa679cd892defa502dacbf";

const client = require("twilio")(accountSid, authToken);

// Numbers
const TO_NUMBER = "+919440004658";
const FROM_NUMBER = "+14782238180";

// API endpoint
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

app.listen(3000, () => {
    console.log("Server running on port 3000");
});