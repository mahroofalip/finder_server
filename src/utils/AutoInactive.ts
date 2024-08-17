import cron from 'node-cron';
import { Op } from 'sequelize';
import User from '../models/User';

export const updateOnlineStatusJob = cron.schedule('* * * * *', async () => {
  try {
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);

    await User.update(
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

    console.log('Updated user online status.');
  } catch (error) {
    console.error('Error updating user online status:', error);
  }
});

export async function updateUserActivity(userId: any,status:boolean) {
    console.log(userId,status);
     User.update(
      { lastActiveAt: new Date(), isOnline: status },  // Update the lastActiveAt timestamp and set isOnline to true
      {
        where: {
          id: userId,
        },
      }
    );
  }
  
