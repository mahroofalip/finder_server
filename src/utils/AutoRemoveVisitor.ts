import cron from 'node-cron';
import { Op } from 'sequelize';
import Visitors from '../models/Visitors';

export const removeOldVisitorRecordsJob = cron.schedule('0 0 * * *', async () => {
  try {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Calculate the date two days ago

    // Delete visitor records older than two days
    await Visitors.destroy({
      where: {
        createdAt: {
          [Op.lt]: twoDaysAgo, // Compare with the createdAt timestamp
        },
      } as any, // Casting to any to bypass TypeScript's type checking
    });

    console.log('Old visitor records removed successfully');
  } catch (error) {
    console.error('Error removing old visitor records:', error);
  }
});
