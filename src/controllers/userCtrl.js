const db = require('../db/index')
const Users = db.users


// register a new user
const addUser = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const user = await Users.create(req.body)
        const token = await user.generateAuthToken()
        console.log('data saved')
        res.status(201).send({ user, token });
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: 'Internal server error!' })
    }
}

// login user
const loginUser = async (req, res) => {
    try {
        const user = await Users.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

// logout user
const logoutUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ error: 'Please authenticate as a user!' })
        }
        const user = req.user
        console.log(user)
        const updatedTokens = user.getDataValue('tokens').filter((token) => {
            return token.token !== req.token
        })

        await Users.update({ tokens: updatedTokens }, { where: { id: user.id } })
        res.send();

    } catch (e) {
        console.log(e)
        res.status(500).send();
    }
}

// logout user from all devices
const logoutAll = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ error: 'Please authenticate as a user!' })
        }
        const user = req.user
        const updatedTokens = []
        await Users.update({ tokens: updatedTokens }, { where: { id: user.id } })
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send();
    }
}

// get user profile
const getUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ error: 'Please authenticate as a user!' })
        }

        res.status(200).send({ user : req.user});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

// update user
const updateUser = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const updates = Object.keys(req.body);
        const allowedUpdates = ['username', 'email', 'password', 'gender', 'departmentId', 'role', 'projectId']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates!' });
        }
        const user = await Users.findOne({ where: { id: req.params.id } })
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.status(200).send({user})
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: 'Internal Server Error' });
    }
}

// Delete user
const deleteUser = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const user = await Users.findOne({ where: { id: req.params.id } })
        // Delete the user
        await user.destroy();

        res.status(204).send({ deletedUser: user });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    addUser,
    loginUser,
    logoutUser,
    logoutAll,
    getUser,
    updateUser,
    deleteUser
}