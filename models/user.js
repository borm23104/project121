module.exports = (sequelize, DataTypes)=>(
    sequelize.define('user', {
        id:{
            type: DataTypes.STRING(20),
            allowNull : false,
            primaryKey:true,
        }, 
        phoneNum:{
            type: DataTypes.STRING(20),
            allowNull : false,
        },
        password:{
            type: DataTypes.STRING(20),
            allowNull:false, 
        },
        cf:{
            type:DataTypes.INTEGER,
            allowNull: true,
        },

    }, {
        timestamps: false,
    }
))