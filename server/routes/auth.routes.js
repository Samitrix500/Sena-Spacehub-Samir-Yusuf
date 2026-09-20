// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { login, logout, register } = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/authenticateToken');

router.post('/login', login);
router.post('/logout', authenticateToken, logout);
router.post('/register', register);

module.exports = router;
