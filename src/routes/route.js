const express = require('express');
const {verifyToken} = require("./authMiddleware");
const {generateOrder} = require("../services/orderServices");
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
})
router.post('/generation', verifyToken, generateOrder)

module.exports = router