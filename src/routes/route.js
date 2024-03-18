const express = require('express');
const {verifyToken} = require("./authMiddleware");
const {generateOrder, getAll, getOrderByCode, updateOrderByCode} = require("../services/orderServices");
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('OK');
})
router.post('/generation', verifyToken, generateOrder)
router.get('/all', verifyToken, getAll)
router.get('/:codOrder', verifyToken, getOrderByCode)
router.put('/:codOrder', verifyToken, updateOrderByCode)

module.exports = router