const express = require('express')
const router = express.Router();
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')

router.post('/users', userCtrl.addUser)
router.post('/users/login', userCtrl.loginUser)
router.post('/users/logout', auth, userCtrl.logoutUser)
router.post('/users/logoutAll', auth, userCtrl.logoutAll)
router.get('/users', auth, userCtrl.getUser)
router.patch('/users' , auth, userCtrl.updateUser)
router.delete('/users', auth, userCtrl.deleteUser)


module.exports = router