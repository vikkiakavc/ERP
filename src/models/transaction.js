module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('transaction', {
        amount : {
            type : DataTypes.DECIMAL(10,2),
            allownull : false
        },
        data: {
            type : DataTypes.DATE,
            allownull : false
        },
        type : {
            type : DataTypes.STRING,
            allownull : false
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