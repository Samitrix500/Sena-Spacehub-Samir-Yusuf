// routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/dashboard.controller');
const authenticateToken = require('../middlewares/authenticateToken');

router.use(authenticateToken);
router.get('/stats', getStats);

module.exports = router;
