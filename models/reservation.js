module.exports = (sequelize, DataTypes)=>(
    sequelize.define('reservation', {
        reservationId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            unique:true,
            primaryKey:true,
            autoIncrement:true,
        },
        userId:{
            type: DataTypes.INTEGER,
            allowNull:false,
        },
        roomId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        reserveDate:{//사용예정날짜
            type:DataTypes.DATEONLY, //yyyy-mm-dd
            allowNull:false,
        },
        reserveFrom:{//예약시작시간. 0~29. 8시=0, 11시=29. 1당 30분
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        reserveTo:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        managerId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        note:{
            type:DataTypes.STRING(45),
            allowNull:true,
        }
    },{
        timestamps:false,
        paranoid: false,
    }
))