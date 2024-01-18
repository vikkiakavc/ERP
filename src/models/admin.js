const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
    const admin = sequelize.define('admin', {
        username : {
            type : DataTypes.STRING,
            allownull : false
        }, 
        email : {
            type : DataTypes.STRING,
            allownull : false,
            unique : true,
            validate : {
                isEmail : true
            },
            set(value) {
                this.setDataValue('email', value.toLowerCase())
            }
        },
        password : {
            type : DataTypes.STRING,
            allownull : false,
            validate: {
                isLongEnough(value) {
                    if (value.length < 9) {
                        throw new Error('password must be atleast 9 characters long!')
                    }
                },
                containsPasswordWord(value) {
                    if (value.toLowerCase()==='password'){
                        throw new Error('password cannot be "password"!')
                    }
                }
            }

        },
        gender: {
            type: DataTypes.STRING,
            allownull: false,
            validate: {
                isIn: {
                    args: [['Male', 'Female']],
                    msg: 'Please select from your gender from Male or Female only'
                }
            }
        },
        role : {
            type : DataTypes.STRING,
            defaultValue : 'ADMIN'
        },
        tokens : {
            type : DataTypes.JSON,
            defaultValue : [],
            allownull : false,
        }
    })

    // pre hooks
    admin.beforeCreate ( async (user, options) =>{
        user.username = user.username.trim();
        user.password = await bcrypt.hash(user.password.trim(), 8)
    })

    admin.beforeUpdate( async (user, options) => {
        if (user.changed('username')){
            user.username = user.username.trim();
        }
        if (user.changed('password')){
            user.password = await bcrypt.hash(user.password.trim(), 8)
        }
    })
    
    // class method for login
    admin.findByCredentials = async function(email, password) {
        const user = await admin.findOne({ where : {email}})
        if (!email) {
            throw new Error('unable to login!')
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new Error('unable to login!')
        }

        return user
    }

    // instance method for generating tokens
    admin.prototype.generateAuthToken = async function(){
        const user = this
        const token = jwt.sign({ id: user.id, userType: 'admin'}, process.env.JWT_SECRET)
        const existingTokens = user.getDataValue('tokens')
        existingTokens.push({token})
        admin.update( 
            { tokens : existingTokens},
            { where : { id : user.id}}
        )
        return token
    }

    // instance method to send selected data to the client
    admin.prototype.toJSON = function () {
        const user = { ...this.get()}

        delete user.password
        delete user.tokens

        return user

    }

    return admin
}