import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
interface InterestAttributes {
  id: number;
  intrest: string;
}
interface InterestCreationAttributes extends Optional<InterestAttributes, 'id'> { }
class Interest extends Model<InterestAttributes, InterestCreationAttributes> implements InterestAttributes {
  public id!: number;
  public intrest!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Interest.init(
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
    tableName: 'SOUL_SPARK_INTERESTS',
    timestamps: true,
  }
);
export default Interest;
