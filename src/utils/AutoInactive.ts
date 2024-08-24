import cron from 'node-cron';
import { Op } from 'sequelize';
import User from '../models/User';

export const updateOnlineStatusJob = cron.schedule('* * * * *', async () => {
  try {
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
     User.update(
      { isOnline: false },
      {
        where: {
          isOnline: true,
          lastActiveAt: {
            [Op.lt]: oneMinuteAgo, // Compare with lastActiveAt
          },
        },
      }
    );
  } catch (error) {
    console.error('Error updating user online status:', error);
  }
});

export async function updateUserActivity(userId: any,status:boolean) {
     User.update(
      { lastActiveAt: new Date(), isOnline: status },  // Update the lastActiveAt timestamp and set isOnline to true
      {
        where: {
          id: userId,
        },
      }
    );
  }
  
