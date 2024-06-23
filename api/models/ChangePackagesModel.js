const conn = require("../connect");
const { DataTypes } = require("sequelize");

const ChangePackagesModel = conn.define("changePackages", {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    packageId:{
        type:DataTypes.BIGINT
    },
    userId:{
        type:DataTypes.BIGINT
    },
});

ChangePackagesModel.sync({ alter: true });
module.exports = ChangePackagesModel