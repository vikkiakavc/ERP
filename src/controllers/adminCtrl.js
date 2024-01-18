const db = require('../db/index')
const Admin = db.admin

// register admin
const addAdmin = async (req, res) => {
    try {
        const superuser = await Admin.create(req.body)
        const token = await superuser.generateAuthToken();
        res.status(201).send({ user: superuser, token })
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: 'Internal server error!' })
    }
}

// login admin
const loginAdmin = async (req, res) => {
    try {
        const superuser = await Admin.findByCredentials(req.body.email, req.body.password)
        if (!superuser) {
            return res.status(404).send({ error: 'Unable to login!' })
        }
        const token = await superuser.generateAuthToken()
        res.status(200).send({ user: superuser, token })
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: 'Internal server error!' })
    }
}

// logout admin
const logoutAdmin = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const updatedTokens = req.admin.getDataValue('tokens').filter((token) => {
            return token.token !== req.token
        })
        await Admin.update(
            { tokens: updatedTokens },
            { where: { id: req.admin.id } }
        )
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: 'Internal server error!' })
    }
}

// logout admin from all devices
const logoutAllAdmin = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const updatedTokens = []
        await Admin.update(
            { tokens: updatedTokens },
            { where: { id: req.admin.id } }
        )
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: 'Internal server error!' })
    }
}

// update superuser
const updateAdmin = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const updates = Object.keys(req.body)
        const allowedUpdates = ['username', 'password', 'email']
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidUpdate) {
            return res.status(404).send({ error: 'invalid updates!' })
        }
        const superuser = req.admin
        updates.forEach((update) => superuser[update] = req.body[update])
        await superuser.save()
        res.status(200).send({ user: superuser })
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: 'Internal server error!' })
    }
}

// delete admin
const deleteAdmin = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const superuser = req.admin
        await req.admin.destroy()
        res.status(204).send({ deletedAdmin: superuser });
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: 'Internal server error!' })
    }
}

module.exports = {
    addAdmin,
    loginAdmin,
    logoutAdmin,
    logoutAllAdmin,
    updateAdmin,
    deleteAdmin,
}
