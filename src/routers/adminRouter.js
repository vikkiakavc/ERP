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


module.exports = router