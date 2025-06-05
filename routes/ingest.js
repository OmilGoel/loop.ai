const express = require('express');
const router = express.Router();
const { handleIngest, getStatus } = require('../services/ingestionService');

router.post('/ingest', handleIngest);
router.get('/status/:id', getStatus);

module.exports = router;
