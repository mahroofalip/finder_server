"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class Room extends sequelize_1.Model {
}
Room.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    senderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    receiverId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    last_message_content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: `${process.env.START_APP_NAME}ROOMS`,
});
Room.belongsTo(User_1.default, { as: 'Sender', foreignKey: 'senderId' });
Room.belongsTo(User_1.default, { as: 'Receiver', foreignKey: 'receiverId' });
exports.default = Room;
