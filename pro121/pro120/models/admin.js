module.exports = (sequelize, DataTypes)=>(
    sequelize.define('admin', {
        id:{
            type: DataTypes.STRING(20),
            allowNull : false,
            primaryKey:true,
        }, 
        password:{
            type: DataTypes.STRING(20),
            allowNull:false, 
        },

    }, {
        timestamps: false,
    }
))