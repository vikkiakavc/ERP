const {Sequelize, DataTypes} = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.authenticate().then(() => {
    console.log('Connected')
}).catch((err) => {
    console.log(err)
})

const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize

db.admin = require('../models/admin')(sequelize, DataTypes)
db.transaction = require('../models/transaction')(sequelize,DataTypes)

db.sequelize.sync({ force: true }).then(() => {
    console.log(' yes re-sync')
})

module.exports = db