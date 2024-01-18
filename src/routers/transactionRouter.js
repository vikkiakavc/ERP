const express = require('express')
const router = express.Router();
const transactionCtrl = require('../controllers/transactionCtrl')
const auth = require('../middleware/auth')

router.post('/transaction', auth, transactionCtrl.addTransaction)
router.patch('/transaction/:id', auth, transactionCtrl.updateTransaction)
router.delete('/transaction/:id', auth, transactionCtrl.deleteTransaction)
router.get('/report', auth, transactionCtrl.generateReport)

module.exports = router