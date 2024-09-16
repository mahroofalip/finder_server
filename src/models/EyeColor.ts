import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EyeColorAttributes {
  id: number;
  eyeColor: string;
}

interface EyeColorCreationAttributes extends Optional<EyeColorAttributes, 'id'> { }

class EyeColor extends Model<EyeColorAttributes, EyeColorCreationAttributes> implements EyeColorAttributes {
  public id!: number;
  public eyeColor!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

EyeColor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    eyeColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: `${process.env.START_APP_NAME}EYECOLORS`,
    timestamps: true,
  }
);

export default EyeColor;
