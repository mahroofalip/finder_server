import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface VisitorsAttributes {
    id: number;
    userId: number;
    profileId: number;
}

interface VisitorsCreationAttributes extends Optional<VisitorsAttributes, 'id'> { }

class Visitors extends Model<VisitorsAttributes, VisitorsCreationAttributes> implements VisitorsAttributes {
    public id!: number;
    public userId!: number;
    public profileId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public user?: User;
    public profile?: User;
}

Visitors.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        profileId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'SOUL_SPARK_VISITORS',
        timestamps: true,
    }
);

Visitors.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Visitors.belongsTo(User, { foreignKey: 'profileId', as: 'profile' });

export default Visitors;
