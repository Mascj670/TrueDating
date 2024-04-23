const express = require('express');
const bodyParser = require('body-parser');
const { default: OpenAI } = require('openai');
const dotenv = require('dotenv');
const app = express();
const port = 3000;

dotenv.config();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static('public'));

app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/profile', (_req, res) => {
    res.sendFile(__dirname + '/public/profile.html');
});

app.post('/print', async (req, res) => {
    console.log('Data Received:', req.body);

    try {
        const chatCompletion = await createChatCompletion(req.body);
        console.log("Chat Completion:", chatCompletion.choices[0].message);
        res.json({ message: chatCompletion.choices[0].message }); // Send JSON response
    } catch (error) {
        console.error("Failed to process data:", error);
        res.status(500).send("Server error");
    }
});

async function createChatCompletion(formData) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [{
            role: "user",
            content: `Create a dating profile using the following details:
            Name: ${formData.firstName} ${formData.lastName},
            Email: ${formData.email},
            Phone: ${formData.phone},
            Instagram: ${formData.instagram}. What makes them unique?`
        }]
    });
    return completion;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
