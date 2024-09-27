"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class UsersPosts extends sequelize_1.Model {
}
UsersPosts.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    postUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    postCaption: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    postLikes: {
        type: sequelize_1.DataTypes.INTEGER, // Changed from NUMBER to INTEGER
        allowNull: true, // Make it nullable if needed
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: `${process.env.START_APP_NAME}USERPOSTS`,
    timestamps: true,
});
UsersPosts.belongsTo(User_1.default, { foreignKey: 'userId' }); // Define the relationship
exports.default = UsersPosts;
