import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface IgnoredUsersAttributes {
    id: number;
    userId: number;
    profileId: number;

}

interface BlokesCreationAttributes extends Optional<IgnoredUsersAttributes, 'id'> { }

class IgnoredUsers extends Model<IgnoredUsersAttributes, BlokesCreationAttributes> implements IgnoredUsersAttributes {
    public id!: number;
    public userId!: number;
    public profileId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

IgnoredUsers.init(
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

export default IgnoredUsers;
