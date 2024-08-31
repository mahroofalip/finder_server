import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface BlockedUsersAttributes {
    id: number;
    userId: number;
    profileId: number;

}

interface BlokesCreationAttributes extends Optional<BlockedUsersAttributes, 'id'> { }

class BlockedUsers extends Model<BlockedUsersAttributes, BlokesCreationAttributes> implements BlockedUsersAttributes {
    public id!: number;
    public userId!: number;
    public profileId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public user?: User; // User who liked
    public profile?: User; // Profile being liked
}

BlockedUsers.init(
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
        tableName: 'FINDER_BLOCKEDUSERS',
        timestamps: true,
    }
);

BlockedUsers.belongsTo(User, { foreignKey: 'userId', as: 'user' });
BlockedUsers.belongsTo(User, { foreignKey: 'profileId', as: 'profile' });
export default BlockedUsers;
