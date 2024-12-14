const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GIPHY_API_KEY;
const limit = 1;

const cache = {};

async function fetchImage(query) {
    if (cache[query]) {
        return cache[query];
    }

    const url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}`;

    try {
        const response = await axios.get(url);
        const items = response.data.data; // Giphy API returns data in the 'data' field
        if (items && items.length > 0) {
            const imageUrl = items[0].images.original.url; // Extract the URL of the original image
            cache[query] = imageUrl;
            return imageUrl;
        }
        return null;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

module.exports = fetchImage;