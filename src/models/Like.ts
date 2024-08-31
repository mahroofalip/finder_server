import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface LikeAttributes {
    id: number;
    userId: number;
    profileId: number;
}

interface LikeCreationAttributes extends Optional<LikeAttributes, 'id'> { }

class Like extends Model<LikeAttributes, LikeCreationAttributes> implements LikeAttributes {
    public id!: number;
    public userId!: number;
    public profileId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    // Define the association properties for TypeScript
    public user?: User; // User who liked
    public profile?: User; // Profile being liked
}

// Initialize the Like model
Like.init(
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
        tableName: 'FINDER_LIKES',
        timestamps: true,
    }
);

// Define associations
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' }); 
Like.belongsTo(User, { foreignKey: 'profileId', as: 'profile' });

export default Like;