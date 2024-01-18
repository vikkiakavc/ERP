module.exports = (sequelize, DataTypes) => {
    const projectDepartment = sequelize.define('projectDepartments', {
        projectId : {
            type : DataTypes.INTEGER,
        },
        departentId : {
            type : DataTypes.INTEGER
        }
    })
    return projectDepartment
}