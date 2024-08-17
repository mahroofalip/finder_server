import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UsersPostsAttributes {
    id: number;
    postUrl: string;
    postCaption: string;
    postLikes: number;

}

interface BlokesCreationAttributes extends Optional<UsersPostsAttributes, 'id'> { }

class UsersPosts extends Model<UsersPostsAttributes, BlokesCreationAttributes> implements UsersPostsAttributes {
    public id!: number;
    public postUrl!: string;
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
    },
    {
        sequelize,
        tableName: 'FINDER_USERPOSTS',
        timestamps: true,
    }
);

export default UsersPosts;
