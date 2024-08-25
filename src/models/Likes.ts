import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface LikesAttributes {
    id: number;
    userId: number;
    profileId: number;

}

interface LikesCreationAttributes extends Optional<LikesAttributes, 'id'> { }

class Likes extends Model<LikesAttributes, LikesCreationAttributes> implements LikesAttributes {
    public id!: number;
    public userId!: number;
    public profileId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Likes.init(
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
Likes.belongsTo(User, { foreignKey: 'userId' }); // Define the relationship


export default Likes;
