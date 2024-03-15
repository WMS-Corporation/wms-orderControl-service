const express = require('express');
const {verifyToken} = require("./authMiddleware");
const {generateOrder, getAll} = require("../services/orderServices");
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World');
})
router.post('/generation', verifyToken, generateOrder)
router.get('/all', verifyToken, getAll)

module.exports = router