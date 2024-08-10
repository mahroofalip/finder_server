import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface HairColorAttributes {
  id: number;
  hairColor: string;
}

interface HairColorCreationAttributes extends Optional<HairColorAttributes, 'id'> { }

class HairColor extends Model<HairColorAttributes, HairColorCreationAttributes> implements HairColorAttributes {
  public id!: number;
  public hairColor!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

HairColor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hairColor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'FINDER_HAIR_COLORS',
    timestamps: true,
  }
);

export default HairColor;
