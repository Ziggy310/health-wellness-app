const express = require('express');
const router = express.Router();
const statusController = require('../controllers/status.controller');

// Get server status - public endpoint, no auth required
router.get('/', statusController.getStatus);

module.exports = router;
