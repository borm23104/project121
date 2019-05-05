module.exports = (sequelize, DataTypes)=>(
    sequelize.define('building', {
        buildingId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
        },
        name:{  //한글저장되나
            type:DataTypes.STRING(35),
            allowNull:false,
        },
        img:{
            type:DataTypes.STRING(50),
            allowNull:true,
        },
        location:{
            type:DataTypes.STRING(25),
            allowNull:true,
        },
    },{
        timestamps:false,
    })
)