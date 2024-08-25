import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface VisitorsAttributes {
    id: number;
    userId: number;
    profileId: number;

}

interface BlokesCreationAttributes extends Optional<VisitorsAttributes, 'id'> { }

class Visitors extends Model<VisitorsAttributes, BlokesCreationAttributes> implements VisitorsAttributes {
    public id!: number;
    public userId!: number;
    public profileId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
        tableName: 'FINDER_VISITORS',
        timestamps: true,
    }
);
Visitors.belongsTo(User, { foreignKey: 'userId' }); // Define the relationship
Visitors.belongsTo(User, { foreignKey: 'profileId' }); // Define the relationship


export default Visitors;
