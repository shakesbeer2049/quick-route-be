const { nanoid } = require('nanoid');
const URL = require('../models/url');
const rateLimit = require('express-rate-limit');

// Configure rate limiter
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5, 
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false, 
});

async function handleGenerateNewShortUrl(req, res) {
    const { redirectUrl } = req.body;

    if (!redirectUrl) {
        return res.status(400).json({ error: 'redirectUrl is required' });
    }

    try {
        const shortId = nanoid(8);
        const url = await URL.create({ shortId, redirectUrl, visitHistory: [] });
        res.status(201).json({ id: shortId });
    } catch (error) {
        console.error('Error saving URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getShortUrl(req, res) {
    const shortId = req.params.shortId;
    console.log('shortId', shortId);
    try {
        const url = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: { timestamp: Date.now() },
                },
            }
        );
        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }
        url.visitHistory.push({ timestamp: Date.now() });
        await url.save();
        res.redirect(url.redirectUrl);
    } catch (error) {
        console.error('Error retrieving URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    handleGenerateNewShortUrl: [limiter, handleGenerateNewShortUrl], 
    getShortUrl: [limiter, getShortUrl], 
};