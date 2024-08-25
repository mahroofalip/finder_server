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
}

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
Like.belongsTo(User, { foreignKey: 'userId' }); // Define the relationship


export default Like;
