const db = require('../db/index')
const Admin = db.admin
const Transaction = db.transaction
const moment = require('moment');

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


// crud ops of user
// register a user
const addUser = async (req, res) => {
    try {

    } catch (e) {

    }
}


// crud ops for transactions

// record transaction
const addTransaction = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const transaction = await Transaction.create(req.body)
        res.status(201).send({ transaction })
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: 'Internal server error!' })
    }
}

// update transaction
const updateTransaction = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const transaction = await Transaction.findOne({ where: { id: req.params.id } })
        const createdAt = new Date(transaction.createdAt);
        const currentDate = new Date();
        const timeDifference = currentDate - createdAt;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        if (daysDifference > 30) {
            return res.status(404).send({ error: 'Sorry, you can not update a transaction after 30 days!' })
        }
        const updates = Object.keys(req.body);
        const alllowedUpdates = ['amount', 'type', 'data', 'description', 'currency']
        const isValidUpdate = updates.every((update) => alllowedUpdates.includes(update))
        if (!isValidUpdate) {
            return res.status(404).send({ error: 'invalid updates!' })
        }
        updates.forEach((update) => transaction[update] = req.body[update])
        await transaction.save()
        res.status(200).send({ transaction })
    } catch (e) {
        console.log(e);
        res.status(500).send({ error: 'Internal server error!' })
    }
}

// delete transaction
const deleteTransaction = async (req, res) => {
    try{
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const transaction = await Transaction.findOne({ where : { id : req.params.id}})
        const createdAt = new Date(transaction.createdAt);
        const currentDate = new Date();
        const timeDifference = currentDate - createdAt;
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
        if (daysDifference > 30) {
            return res.status(404).send({ error: 'Sorry, you can not delete a transaction after 30 days!' })
        }
        await transaction.destroy();
        res.status(200).send({ message : 'success',transaction})
    }catch(e) {
        console.log(e);
        res.status(500).send({ error: 'Internal server error!' })
    }
}

// generate report
const generateReport = async (req, res) => {
    try{
        if (!req.admin) {
            return res.status(404).send({ error: 'Please authenticate as an admin!' })
        }
        const { startDate, endDate} = req.query
        startDate = new Date(startDate)
        endDate = new Date(endDate)
        const transaction = await Transaction({ where : {
            
        }})
    }catch(e) {

    }
}



module.exports = {
    addAdmin,
    loginAdmin,
    logoutAdmin,
    logoutAllAdmin,
    updateAdmin,
    deleteAdmin,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    generateReport
}
