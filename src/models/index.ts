import sequelize from '../config/database';
import User from './User';
import EyeColor from './EyeColor';
import HairColor from './HairColor';
import Gender from './Gender';
import Room from './Rooms';
import Message from './Message';
import insertData from '../dataInserts';

// Define associations
User.belongsTo(EyeColor, { foreignKey: 'eyeColorId', as: 'eyeColor' });
User.belongsTo(HairColor, { foreignKey: 'hairColorId', as: 'hairColor' });
User.belongsTo(Gender, { foreignKey: 'genderId', as: 'gender' });

Room.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
Room.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });

Message.belongsTo(Room, { foreignKey: 'room_id' });

// Synchronize all models and insert predefined data
const syncAndInsertData = async () => {
  try {
    await sequelize.sync({ force: true }); // Drop and recreate tables
    // await insertData()
    // console.log('Database synchronized successfully.');

    // // Insert predefined data
    // const availableEyeColors = ['Brown', 'Black', 'Blue', 'Green', 'Hazel', 'Amber', 'Gray'];
    // const availableGenders = [
    //   'Male', 'Female', 'Non-binary', 'Genderqueer', 'Genderfluid', 'Agender', 'Bigender', 'Two-Spirit',
    //   'Pangender', 'Androgynous', 'Demiboy', 'Demigirl', 'Transgender', 'Trans Women', 'Trans Men',
    //   'Cross-Dresser', 'Cisgender', 'Intersex', 'Neutrois', 'Questioning', 'Other'
    // ];
    // const availableHairColors = ['Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White'];

    // await Promise.all([
    //   ...availableEyeColors.map(color => EyeColor.findOrCreate({ where: { eyeColor: color } })),
    //   ...availableGenders.map(gender => Gender.findOrCreate({ where: { gender: gender } })),
    //   ...availableHairColors.map(color => HairColor.findOrCreate({ where: { hairColor: color } }))
    // ]);

    // console.log('Predefined data has been added.');
  } catch (error) {
    console.error('Error during synchronization and data insertion:', error);
  }
};

syncAndInsertData();

export { sequelize };
