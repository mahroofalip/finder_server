import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
interface ProfessionAttributes {
  id: number;
  profession: string;
}
interface ProfessionCreationAttributes extends Optional<ProfessionAttributes, 'id'> { }
class Profession extends Model<ProfessionAttributes, ProfessionCreationAttributes> implements ProfessionAttributes {
  public id!: number;
  public profession!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Profession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'FINDER_PROFESSIONS',
    timestamps: true,
  }
);
export default Profession;
