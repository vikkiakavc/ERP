module.exports = (sequelize, DataTypes) => {
    const projectDepartment = sequelize.define('projectDepartments', {
        projectId : {
            type : DataTypes.INTEGER,
        },
        departmentId : {
            type : DataTypes.INTEGER,
        }
    })
    return projectDepartment
}