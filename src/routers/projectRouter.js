const express = require('express')
const router = express.Router();
const projectCtrl = require('../controllers/projectCtrl')
const auth = require('../middleware/auth')

router.post('/project', auth, projectCtrl.createProject)
router.get('/project/:id', auth, projectCtrl.getProjectById)
router.patch('/project/:id', auth, projectCtrl.updateProjectById)
router.delete('/project/:id', auth, projectCtrl.deleteProjectById)
router.get('/projects', auth, projectCtrl.getAllProjects)
router.post('/assignProject', auth, projectCtrl.assignProject)
router.post('/unassignProject', auth, projectCtrl.unassignProject)
router.get('/allUsers/:id', auth, projectCtrl.getAllUsers)


module.exports = router