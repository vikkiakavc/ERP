const db = require('../db/index')
const Department = db.department
const User = db.users
const Project = db.project
const projectDepartmentRelation = db.projectDepartment

const addDepartment = async (req, res) => {
    if (!req.admin) {
        return res.status(404).send({ error: 'Please authenticate as an admin!' })
    }
    try {
        const department = await Department.create(req.body);
        res.status(201).send({ department });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({ error: "Error creating Department" })
    }
}

const updateDepartment = async (req, res) => {
    if (!req.admin) {
        return res.status(404).send({ error: 'Please authenticate as an admin ' })
    }
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'description']
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidUpdate) {
            return res.status(404).json({ message: "invalid update!" })
        }

        const departmentId = req.params.departmentId;
        const department = await Department.findByPk(departmentId);

        if (!department) {
            return res.status(404).json({ message: "department not found!" })
        }

        //updating the attributes
        updates.forEach((update) => department[update] = req.body[update])

        await department.save()

        res.json(department)
    }
    catch (e) {
        console.log(e)
        res.status(500).send({ error: "Error updating Department" })
    }
}

const deleteDepartment = async (req, res) => {
    if (!req.admin) {
        return res.status(404).send({ error: "please authenticate as admin first" })
    }
    try {
        const departmentId = req.params.departmentId;

        const department = await Department.findByPk(departmentId);

        if (!department) {
            return res.status(404).json({ message: "department not found!" })
        }

        const deletedRelation = await projectDepartmentRelation.destroy({
            where: {
                departmentId
            },
        });

        await department.destroy();
        res.status(204).json(department);

    }
    catch (e) {
        res.status(500).send({ error: " Error deleting department" })
    }
}

//Get all department
const departmentlist = async (req, res) => {
    if (!req.admin) {
        res.status(404).send({ error: "Please authenticate as admin first" })
    }
    try {
        const name = req.query.name
        let wherecondition = {}

        if (name) {
            wherecondition.name = name;
        }
        const departments = await Department.findAll({
            where: wherecondition,
        });
        res.json(departments);
    }
    catch (e) {
        console.log(e)
        res.status(500).send({ error: "Error generating list" })
    }
}

//Get all projects under department
const getAllProject = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const departmentId = req.params.departmentId;
        const projectWithdepartment = await Department.findByPk(departmentId, {
            include: [{
                model: Project,
                as: 'projects'
            }]
        });
        if (projectWithdepartment) {
            res.json(projectWithdepartment);
        } else {
            res.status(404).send('Projects not found');
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: "Error generating list" })
    }
}

module.exports = {
    addDepartment,
    updateDepartment,
    deleteDepartment,
    departmentlist,
    getAllProject,
}


