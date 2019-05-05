module.exports = (sequelize, DataTypes)=>(
    sequelize.define('favorite', {
        roomId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
        },
        id:{
            type:DataTypes.STRING(25),
            allowNull:false,
        },
    },{
        timestamps:false,
    })
)