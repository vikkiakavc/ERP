module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('project', {
        projectName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clientName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description : {
            type : DataTypes.TEXT,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        deadline : {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('in progress', 'completed', 'on hold'),
            allowNull: false,
        }
    })
    return Project
}