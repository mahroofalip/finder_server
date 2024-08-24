import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User'; 

interface RoomAttributes {
    id: number;
    senderId: number;
    receiverId: number;
    last_message_content: string;
}

interface RoomCreationAttributes extends Optional<RoomAttributes, 'id'> { }

class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
    public id!: number;
    public senderId!: number;
    public receiverId!: number;
    public last_message_content!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Room.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        last_message_content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'FINDER_ROOMS',
    }
);

Room.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Room.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });
export default Room;
