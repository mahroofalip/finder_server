"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class SidebarMenu extends sequelize_1.Model {
}
SidebarMenu.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    label: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    icon: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isEnabled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Set default value to true
    },
}, {
    sequelize: database_1.default,
    tableName: `${process.env.START_APP_NAME}SIDEBARMENUS`,
    timestamps: true,
});
exports.default = SidebarMenu;
