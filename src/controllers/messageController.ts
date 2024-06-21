import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message'; // Import the Message model
import { notifyUser } from '../sockets/socket';
import { Op } from 'sequelize';
import Room from '../models/Rooms';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export const sendMessage = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { message_content, receiverId, room_id, status } = req.body;
    
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const senderId = req.user.id;

    
    const room = await Room.create({
        senderId,
        receiverId,
      });

    // const message = await Message.create({
    //   message_content,
    //   room_id:room ,
    //   status,
    // });

    // notifyUser(room_id, message_content);
    // res.status(200).send({message});
  } catch (error) {
    next(error);
  }
};

export const getUserChats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new Error('User not authenticated');
      }
      const userId = req.user.id;
      const userChats = await Room.findAll({
        where: {
          [Op.or]: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      });
      res.status(200).send(userChats);
    } catch (error) {
      next(error);
    }
  };