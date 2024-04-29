// server.js
import express from 'express';
import bodyParser from 'body-parser';
import { default as OpenAI } from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { getPastesForAccount, getBreachesForAccount } from './hibpAPI.js';
import { lookupNumber, getBalance } from './carrierLookupAPI.js'; // Import the carrier lookup functions

dotenv.config();

const app = express();
const port = 3000;
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function delay(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/profile', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'profile.html')));

app.post('/print', async (req, res) => {
    try {
        const email = req.body.email;
        const phoneNumber = req.body.phone;
        const firstName = req.body.firstName;

        // Fetch breaches first and apply a delay for rate limiting
        const breaches = await getBreachesForAccount(email);
        await delay(7000); // Delay to handle rate limits

        // Fetch pastes after the delay
        const pastes = await getPastesForAccount(email);
        
        // Fetch carrier info concurrently since it's from a different API
        const carrierInfo = await lookupNumber(phoneNumber);

        const profilePrompt = `Create a dating profile for ${firstName} who is involved in breaches: ${breaches.map(b => b.Name).join(", ")}. They use a phone serviced by ${carrierInfo.carrier} which is a ${carrierInfo.carrier_type} number.`;

        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [{
                role: "system",
                content: profilePrompt
            }]
        });

        fs.writeFile(path.join(__dirname, 'public', 'data.json'), JSON.stringify({
            breaches,
            pastes,
            profile: chatCompletion.choices[0].message,
            carrier: carrierInfo
        }, null, 2), err => {
            if (err) throw err;
            res.redirect('/profile');
        });
    } catch (error) {
        console.error("Failed to process data:", error);
        res.status(500).send("Server error");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
