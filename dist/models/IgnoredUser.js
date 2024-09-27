"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class IgnoredUser extends sequelize_1.Model {
}
IgnoredUser.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    profileId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: `${process.env.START_APP_NAME}IGNOREDUSERS`,
    timestamps: true,
});
IgnoredUser.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user' }); // Alias for the user who is ignoring
IgnoredUser.belongsTo(User_1.default, { foreignKey: 'profileId', as: 'profile' }); // Alias for the ignored profile
exports.default = IgnoredUser;
