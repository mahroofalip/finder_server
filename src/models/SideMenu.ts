import { DataTypes, Model, Optional } from "sequelize";
import sequelize from '../config/database';

interface SidebarMenuAttributes {
  id: number;
  label: string;
  icon: string;
  isEnabled: boolean;  // Add the isEnabled attribute
}

interface SidebarMenuCreationAttributes extends Optional<SidebarMenuAttributes, 'id'> {}

class SidebarMenu extends Model<SidebarMenuAttributes, SidebarMenuCreationAttributes> implements SidebarMenuAttributes {
  public id!: number;
  public label!: string;
  public icon!: string;
  public isEnabled!: boolean;  // Implement the isEnabled attribute
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SidebarMenu.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,  // Set default value to true
    },
  },
  {
    sequelize,
    tableName: `${process.env.START_APP_NAME}SIDEBARMENUS`,
    timestamps: true,
  }
);

export default SidebarMenu;
