import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Room from './Rooms'; // Import Room model

interface MessageAttributes {
    id: number;
    message_content: string;
    room_id: number;
    status: string;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> { }

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
    public id!: number;
    public message_content!: string;
    public room_id!: number;
    public status!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        message_content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        room_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'FINDER_MESSAGES',
    }
);

Message.belongsTo(Room, { foreignKey: 'room_id' }); // Define the relationship

export default Message;
