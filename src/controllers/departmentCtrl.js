const db = require('../db/index')
const Department = db.department
const User=db.users
const Project=db.project

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
        if (!isValidUpdate){
            return res.status(404).json({ message: "invalid update!" })
        }

        const departmentId = req.params.departmentId;
        const department = await Department.findByPk(departmentId);

        if (!department) {
            return res.status(404).json({ message: "department not found!" })
        }

        //updating the attributes
        updates.forEach((update) => department[update]= req.body[update])

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
        // corresponding users in the department
        const users = await User.findAll({
            where:{
                departmentId
            }
        })
        //corresponding projects in department
        const projects = await Project.findAll({
            where:{
                departmentId
            }
        })

        if(users||projects)
        {
            return res.send({message:"Remove associated users and projects first!"})
        }

        await department.destroy();
        res.status(204).json(department);

    }
    catch (e) {
        res.status(500).send({ error: " Error deleting department" })
    }
}

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
        res.status(500).send({ error: "Error generating list" })
    }
}

module.exports = {
    addDepartment,
    updateDepartment,
    deleteDepartment,
    departmentlist,
}


