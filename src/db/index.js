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
db.department =require('../models/depatment')(sequelize,DataTypes)
db.users = require('../models/users')(sequelize, DataTypes)
db.project = require('../models/project')(sequelize, DataTypes)
db.userProject = require('../models/userProject')(sequelize, DataTypes)
db.projectDepartment = require('../models/userProject')(sequelize, DataTypes)

// one to many between users and department 
db.department.hasMany(db.users, {foreignKey: 'departmentId'})
db.users.belongsTo(db.department, {foreignKey: 'departmentId'})

// many to many between users and project
db.users.belongsToMany(db.project , { foreignKey: 'userId', through : 'userProjects'})
db.project.belongsToMany(db.users , { foreignKey: 'projectId', through : 'userProjects'})

//many to many between department and project
db.department.belongsToMany(db.project , { foreignKey: 'departmentId', through : 'projectDepartments'})
db.project.belongsToMany(db.department , { foreignKey: 'projectId', through : 'projectDepartments'})

db.sequelize.sync({ force: true }).then(() => {
    console.log(' yes re-sync')
})

module.exports = db