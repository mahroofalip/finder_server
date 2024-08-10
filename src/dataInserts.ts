import sequelize from './config/database';
import Gender from './models/Gender';
import EyeColor from './models/EyeColor';
import HairColor from './models/HairColor';

// Predefined data
const genders = [
  'Male', 'Female', 'Non-binary', 'Genderqueer', 'Genderfluid', 'Agender',
  'Bigender', 'Two-Spirit', 'Pangender', 'Androgynous', 'Demiboy', 'Demigirl',
  'Transgender', 'Trans Women', 'Trans Men', 'Cross-Dresser', 'Cisgender',
  'Intersex', 'Neutrois', 'Questioning', 'Other'
];

const eyeColors = [
  'Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Amber', 'Other'
];

const hairColors = [
  'Black', 'Brown', 'Blonde', 'Red', 'Gray', 'White'
];

const insertData = async () => {
  try {
    // Insert Genders
    for (const gender of genders) {
      await Gender.findOrCreate({ where: { gender } });
    }
    console.log('Genders inserted.');

    // Insert EyeColors
    for (const color of eyeColors) {
      await EyeColor.findOrCreate({ where: { eyeColor: color } });
    }
    console.log('Eye colors inserted.');

    // Insert HairColors
    for (const color of hairColors) {
      await HairColor.findOrCreate({ where: { hairColor: color } });
    }
    console.log('Hair colors inserted.');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

// Export the function to be used in index.ts
export default insertData;
