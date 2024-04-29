// Import dependencies
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Configure environment variables
dotenv.config();

// API key and headers configuration
const apiKey = process.env.HIBP_API_KEY;
const headers = {
    'hibp-api-key': apiKey,
    'user-agent': 'NodeServerExample'  // Change 'NodeServerExample' to your app's actual name
};

async function getBreachesForAccount(email) {
    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Failed to fetch breaches: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

async function getPastesForAccount(email) {
    const url = `https://haveibeenpwned.com/api/v3/pasteaccount/${encodeURIComponent(email)}`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`Failed to fetch pastes: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

export { getBreachesForAccount, getPastesForAccount };
