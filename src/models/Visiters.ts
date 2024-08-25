import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface VisitersAttributes {
    id: number;
    userId: number;
    profileId: number;

}

interface BlokesCreationAttributes extends Optional<VisitersAttributes, 'id'> { }

class Visiters extends Model<VisitersAttributes, BlokesCreationAttributes> implements VisitersAttributes {
    public id!: number;
    public userId!: number;
    public profileId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Visiters.init(
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
        tableName: 'FINDER_VISITERS',
        timestamps: true,
    }
);
Visiters.belongsTo(User, { foreignKey: 'userId' }); // Define the relationship
Visiters.belongsTo(User, { foreignKey: 'profileId' }); // Define the relationship


export default Visiters;
