import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RoomAttributes {
    id: string;
    senderId: number;
    receiverId: number;
}

interface RoomCreationAttributes extends Optional<RoomAttributes, 'id'> { }

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
    public id!: string;
    public senderId!: number;
    public receiverId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Room.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        senderId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        receiverId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'FINDER_ROOMS',
    }
);

export default Room;
