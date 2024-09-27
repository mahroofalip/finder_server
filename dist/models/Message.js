"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Rooms_1 = __importDefault(require("./Rooms")); // Import Room model
class Message extends sequelize_1.Model {
}
Message.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    message_content: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    room_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    senderId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // shuould change false
    },
    receiverId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // shuould change false
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: `${process.env.START_APP_NAME}MESSAGES`,
});
Message.belongsTo(Rooms_1.default, { foreignKey: 'room_id' }); // Define the relationship
exports.default = Message;
