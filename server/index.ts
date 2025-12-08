import express from 'express';
import cors from 'cors';
import { scrapeUrl } from '../scripts/crawler.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/scrape', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        console.log(`Received scrape request for: ${url}`);
        const data = await scrapeUrl(url);

        if (!data) {
            return res.status(500).json({ error: 'Failed to scrape data' });
        }

        res.json(data);
    } catch (error: any) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Crawler Server running on http://localhost:${PORT}`);
});
