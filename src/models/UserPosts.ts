import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface UsersPostsAttributes {
    id: number;
    postUrl: string;
    userId: number;
    postCaption: string;
    postLikes: number;

}

interface BlokesCreationAttributes extends Optional<UsersPostsAttributes, 'id'> { }

class UsersPosts extends Model<UsersPostsAttributes, BlokesCreationAttributes> implements UsersPostsAttributes {
    public id!: number;
    public postUrl!: string;
    public userId!: number;
    public postCaption!: string;
    public postLikes!: number;
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
            type: DataTypes.NUMBER,
            allowNull: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'FINDER_USERPOSTS',
        timestamps: true,
    }
);

UsersPosts.belongsTo(User, { foreignKey: 'userId' }); // Define the relationship
export default UsersPosts;
