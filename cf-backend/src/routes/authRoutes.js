const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, me, refresh, logout } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const validate = require('../validators/validate');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', authLimiter, registerValidation, validate, register);
router.post('/login', authLimiter, loginValidation, validate, login);
router.get('/me', authenticate, me);
router.post('/refresh', authLimiter, refresh);
router.post('/logout', logout);

module.exports = router;
