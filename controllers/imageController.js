const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.CX;

async function fetchImage(query) {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${CX}&searchType=image&key=${API_KEY}&num=1`;
    try {
        const response = await axios.get(url);
        const items = response.data.items;
        if (items && items.length > 0) {
            return items[0].link;
        }
        return null;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

module.exports = fetchImage;