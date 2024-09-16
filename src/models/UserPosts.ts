import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface UsersPostsAttributes {
    id: number;
    postUrl: string;
    userId: number;
    postCaption: string;
    postLikes?: number;  // Make optional if it can be null
}

interface UsersPostsCreationAttributes extends Optional<UsersPostsAttributes, 'id'> {}

class UsersPosts extends Model<UsersPostsAttributes, UsersPostsCreationAttributes> implements UsersPostsAttributes {
    public id!: number;
    public postUrl!: string;
    public userId!: number;
    public postCaption!: string;
    public postLikes?: number;  // Make optional if it can be null
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

UsersPosts.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        postUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postCaption: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postLikes: {
            type: DataTypes.INTEGER,  // Changed from NUMBER to INTEGER
            allowNull: true,          // Make it nullable if needed
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: `${process.env.START_APP_NAME}USERPOSTS`,
        timestamps: true,
    }
);

UsersPosts.belongsTo(User, { foreignKey: 'userId' }); // Define the relationship
export default UsersPosts;
