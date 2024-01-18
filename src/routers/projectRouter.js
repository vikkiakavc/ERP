const express = require('express')
const router = express.Router();
const projectCtrl = require('../controllers/projectCtrl')
const auth = require('../middleware/auth')

router.post('/transaction', auth, projectCtrl.createProject)
router.get('/transaction/:id', auth, projectCtrl.getProjectById)
router.patch('/transaction/:id', auth, projectCtrl.updateProjectById)
router.delete('/transaction/:id', auth, projectCtrl.deleteProjectById)
router.get('/transaction', auth, projectCtrl.getAllProjects)

module.exports = router