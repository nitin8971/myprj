const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/search-and-scrape', async (req, res) => {
    const { query } = req.body;
    try {
        const searchResults = await getSearchResults(query);
        const scrapedText = await scrapeURLs(searchResults);
        res.json({ results: scrapedText });
    } catch (error) {
        console.error('Error during search and scraping:', error.message);
        res.status(500).json({ error: 'Error during search and scraping' });
    }
});

async function getSearchResults(query) {
    const apiKey = 'AIzaSyDpUQxQMUyyJ4TY-VR58fMtRt9b9nOzdsk'; 
    const cx = '7d594fa13e424201';   
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}&num=5`;

    try {
        const response = await axios.get(url);
        return response.data.items.map(item => item.link);
    } catch (error) {
        throw new Error('Error fetching search results from Custom Search API');
    }
}

async function scrapeURLs(searchResults) {
    const scrapingBeeAPIKey = 'HJFMXMI6JC69V005TLVZY82GE3QQYGSSAQMW80E2S0CIPAHMN6NT50XI05KZPG9HN6L9QCR59BLUXT15'; 
    const scrapedTexts = [];

    for (const url of searchResults) {
        const scrapingUrl = `https://app.scrapingbee.com/api/v1/extract?url=${encodeURIComponent(url)}&api_key=${scrapingBeeAPIKey}`;

        try {
            const response = await axios.get(scrapingUrl);
            scrapedTexts.push(response.data.text);
        } catch (error) {
            console.error(`Error scraping ${url} with ScrapingBee API:`, error.message);
            scrapedTexts.push('Error scraping the URL.');
        }
    }

    return scrapedTexts;
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
