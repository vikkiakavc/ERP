const { DECIMAL } = require('sequelize');
const db = require('../db/index')
const Project = db.project
const Department = db.department
 
// Create a new project
const createProject = async (req, res) => {
  try {
    const { projectName, clientName, startDate, deadline, description, status, department } = req.body;
    const dep = await Department.findOne({ where : {
        name : department
    }})
    const departmentId = dep.id
    const dl = new Date(deadline)
    const newProject = await Project.create({
      projectName,
      clientName,
      departmentId,
      startDate,
      dl,
      description,
      status
    });
 
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Read all projects
const getAllProjects = async (req, res) => {
  try {
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 10
    const projects = await Project.findAll({
        where : {

        },
        offset : (page-1)*pageSize,
        limit : page
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Read a specific project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
 
    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    console.error('Error reading project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 
// Update a project by ID
const updateProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = Object.keys(req.body)
    const allowedUpdates = ['projectName', 'deadline', 'description', 'status', 'department'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidUpdate){
        return res.status(404).send({ error : 'Invalid update!'})
    }
    const project = await Project.findByPk(id)
    updates.forEach((update) => project[update] = req.body[update])
 
    await project.save()
    res.status(200).send({ updatedProject: project})
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
 
// Delete a project by ID
const deleteProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id)
    await project.destroy();
    res.status(204).send({ deletedProject : project})
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById
}