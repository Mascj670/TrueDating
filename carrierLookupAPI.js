// carrierLookupAPI.js
import fetch from 'node-fetch';

const API_KEY = process.env.CARRIER_LOOKUP_API_KEY; // Make sure this is set in your .env file

async function lookupNumber(phoneNumber) {
    const url = `http://www.carrierlookup.com/index.php/api/lookup?key=${API_KEY}&number=${phoneNumber}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

async function getBalance() {
    const url = `http://www.carrierlookup.com/index.php/api/balance?key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

export { lookupNumber, getBalance };
