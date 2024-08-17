import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface InterestsAttributes {
  id: number;
  intrest: string;
}

interface InterestsCreationAttributes extends Optional<InterestsAttributes, 'id'> { }

class Interests extends Model<InterestsAttributes, InterestsCreationAttributes> implements InterestsAttributes {
  public id!: number;
  public intrest!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Interests.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    intrest: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'FINDER_INTERESTS',
    timestamps: true,
  }
);

export default Interests;
