const express = require('express');
const {handleGenerateNewShortUrl, getShortUrl} = require('../controllers/urlController');
const router = express.Router();


router.post('/url', handleGenerateNewShortUrl);

router.get("/:shortId", getShortUrl );

module.exports = router;