const express = require('express')
const router = express.Router();
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')

router.post('/users', auth, userCtrl.addUser)
router.post('/users/login', userCtrl.loginUser)
router.post('/users/logout', auth, userCtrl.logoutUser)
router.post('/users/logoutAll', auth, userCtrl.logoutAll)
router.patch('/users/:id' , auth, userCtrl.updateUser)
router.delete('/users/:id', auth, userCtrl.deleteUser)
router.get('/users',auth,userCtrl.getuserProfile)


module.exports = router