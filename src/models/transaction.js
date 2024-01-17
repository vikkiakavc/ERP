module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('transaction', {
        amount : {
            type : DataTypes.DECIMAL(10,2),
            allownull : false
        },
        type : {
            type: DataTypes.ENUM('Income', 'Expanse'),
            allowNull: false,
        },
        description : {
            type : DataTypes.TEXT,
        },
        currency : {
            type : DataTypes.STRING,
            allownull : false,
            set(value) {
                this.setDataValue('currency' , value.toUpperCase())
            }
        }
    })
    return Transaction;
}