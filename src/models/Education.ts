import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface EducationAttributes {
  id: number;
  education: string;
}

interface EducationCreationAttributes extends Optional<EducationAttributes, 'id'> { }

class Education extends Model<EducationAttributes, EducationCreationAttributes> implements EducationAttributes {
  public id!: number;
  public education!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Education.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'SOUL_SPARK_EDUCATIONS',
    timestamps: true,
  }
);

export default Education;
