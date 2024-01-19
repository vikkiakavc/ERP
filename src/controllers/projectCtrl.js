const { DECIMAL } = require('sequelize');
const db = require('../db/index')
const Project = db.project
const Department = db.department
const Users = db.users
const ProjectUserRelation = db.userProject

// Create a new project
const createProject = async (req, res) => {
    try {
        const { projectName, clientName, startDate, deadline, description, status, department } = req.body;
        const dep = await Department.findOne({
            where: {
                name: department
            }
        })
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
        // const page = req.query.page || 1
        // const pageSize = req.query.pageSize || 10

        const { departmentId, status, deadline, page = 1, pageSize = 10 } = req.query;
        const filter = {};
        if (departmentId) filter.departmentId = departmentId;
        if (status) filter.status = status;
        if (deadline) filter.deadline = deadline;

        const projects = await Project.findAll({
            where: {
                filter
            },
            offset: (page - 1) * pageSize,
            limit: page
        });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error reading projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Assign Project
const assignProject = async (req, res) => {
    try {
        //const { projectId } = req.params;
        const { userId, projectId } = req.body;

        // Check if the user exists
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check user's department with project's department
        const project = await Project.findByPk(projectId);
        if (!project || project.departmentId !== user.departmentId) {
            return res.status(400).json({ error: 'Invalid assignment. User and project departments do not match.' });
        }

        // Check user workload (5 or more projects)
        const userProjectsCount = await ProjectUserRelation.count({ where: { userId } });
        if (userProjectsCount >= 5) {
            return res.status(400).json({ error: 'User workload exceeds the limit. Cannot assign more projects.' });
        }

        // Create a relation between the project and user
        const projectUserRelation = await ProjectUserRelation.create({
            projectId,
            userId,
        });

        res.status(201).json({ message: "Successfully alloted", projectUserRelation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const unassignProject =async (req, res) => {
  
  try {
    // Find and delete the ProjectUserRelation entry
    const { userId, projectId } = req.body;
    const deletedRelation = await ProjectUserRelation.destroy({
      where: {
        projectId: projectId,
        userId: userId,
      },
    });

    if (deletedRelation) {
      res.status(200).json({ message: 'Project assignment deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Project assignment not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Read a specific project by ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    // const project = await Project.findByPk(id);
    if (!req.user) {
      return res.status(401).send({ error: 'Please authenticate as a user!' })
    }
    const projectWithUsers = await Project.findByPk(id, {
        include: [{
            model: Users,
            as: 'users'
        }]
    });

    if (!projectWithUsers) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(projectWithUsers.users);
  } catch (error) {
    // console.error('Error reading project:', error);
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
        if (!isValidUpdate) {
            return res.status(404).send({ error: 'Invalid update!' })
        }
        const project = await Project.findByPk(id)
        updates.forEach((update) => project[update] = req.body[update])

        await project.save()
        res.status(200).send({ updatedProject: project })
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
        res.status(204).send({ deletedProject: project })
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const getAllUsers = async (res,req) => {
  try {
    const projectId = req.user.projectId;
    const projectWithUsers = await Project.findByPk(projectId, {
        include: [{
            model: Users,
            as: 'users' // Adjust this according to your model associations
        }]
    });
    if (projectWithUsers) {
        res.json(projectWithUsers.users);
    } else {
        res.status(404).send('Project not found');
    }
} catch (error) {
    console.error(error);
    res.status(500).send('Internal server error!');
}
}

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById,
    assignProject,
    getAllUsers
}