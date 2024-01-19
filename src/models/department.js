module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define("department", {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: {
          type: DataTypes.STRING,
          allowNull: false,
        }
    });
    return Department;
  };