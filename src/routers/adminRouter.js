const express = require('express')
const router = express.Router();
const adminCtrl = require('../controllers/adminCtrl')
const auth = require('../middleware/auth')

router.post('/admin/register', adminCtrl.addAdmin)
router.post('/admin/login', adminCtrl.loginAdmin)
router.post('/admin/logout', auth, adminCtrl.logoutAdmin)
router.post('/admin/logoutAll', auth, adminCtrl.logoutAllAdmin)
router.patch('/admin/update', auth, adminCtrl.updateAdmin)
router.delete('/admin/delete', auth, adminCtrl.deleteAdmin)
router.post('/transaction', auth, adminCtrl.addTransaction)
router.patch('/transaction/:id', auth, adminCtrl.updateTransaction)
router.delete('/transaction/:id', auth, adminCtrl.deleteTransaction)
router.get('/report', auth, adminCtrl.generateReport)


module.exports = router