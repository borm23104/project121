module.exports=(sequelize, DataTypes)=>(
    sequelize.define('room', {
        roomId:{
            type:DataTypes.INTEGER,
            allowNull: false,
            primaryKey:true,
            autoIncrement:true,
        },
        roomNo:{
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        floor:{
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        computer:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false,
        },
        projector:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false,
        },
        chalkboard:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false,
        },
        parking:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false,
        },
        capacity:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        image1:{//파일명저장 칼럼 3개만들까 아니면 하나에 합쳐서넣을까
            type:DataTypes.STRING(50),
            allowNull:true,
        },
        image2:{//파일명저장 칼럼 3개만들까 아니면 하나에 합쳐서넣을까
            type:DataTypes.STRING(50),
            allowNull:true,
        },
        image3:{//파일명저장 칼럼 3개만들까 아니면 하나에 합쳐서넣을까
            type:DataTypes.STRING(50),
            allowNull:true,
        },
        buildingId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    },{})
)