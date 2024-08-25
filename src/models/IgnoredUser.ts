import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface IgnoredUserAttributes {
    id: number;
    userId: number;
    profileId: number;

}

interface BlokesCreationAttributes extends Optional<IgnoredUserAttributes, 'id'> { }

class IgnoredUser extends Model<IgnoredUserAttributes, BlokesCreationAttributes> implements IgnoredUserAttributes {
    public id!: number;
    public userId!: number;
    public profileId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

IgnoredUser.init(
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
        tableName: 'FINDER_IGNOREDUSERS',
        timestamps: true,
    }
);
IgnoredUser.belongsTo(User, { foreignKey: 'userId' }); // Define the relationship

export default IgnoredUser;
