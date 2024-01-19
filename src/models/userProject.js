module.exports = (sequelize, DataTypes) => {
    const userProjects = sequelize.define('userProjects', {
        userId : {
            type : DataTypes.INTEGER,
        },
        projectId : {
            type : DataTypes.INTEGER,
        }
    })
    return userProjects
}