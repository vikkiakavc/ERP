const express = require('express')
const router = express.Router();

const departmentCtrl = require('../controllers/departmentCtrl')
const auth = require('../middleware/auth')
//const errorHandler = require('../middleware/error')


router.post('/departments',auth, departmentCtrl.addDepartment)
router.patch('/departments/:departmentId',auth, departmentCtrl.updateDepartment)
router.delete('/departments/:departmentId', auth, departmentCtrl.deleteDepartment)
router.get('/departments', auth, departmentCtrl.departmentlist)
router.get('/projectsOfDep/:departmentId',auth,departmentCtrl.getAllProject)

//router.use(errorHandler);

module.exports = router