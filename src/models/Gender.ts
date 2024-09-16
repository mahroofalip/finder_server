import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface GenderAttributes {
  id: number;
  gender: string;
}

interface GenderCreationAttributes extends Optional<GenderAttributes, 'id'> { }

class Gender extends Model<GenderAttributes, GenderCreationAttributes> implements GenderAttributes {
  public id!: number;
  public gender!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Gender.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: `${process.env.START_APP_NAME}GENDERS`,
    timestamps: true,
  }
);

export default Gender;
