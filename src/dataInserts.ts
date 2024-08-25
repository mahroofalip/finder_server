import Gender from './models/Gender';
import EyeColor from './models/EyeColor';
import HairColor from './models/HairColor';
import Profession from './models/Profession';
import Education from './models/Education';
import Interest from './models/Interest';
// import Likes from './models/Likes';
// import Visiters from './models/Visiters';
// import BlockedUsers from './models/BlokedUsers';
// import IgnoredUsers from './models/IgnoredUsers';

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

const professions = [
  'Software Developer', 'Data Scientist', 'Product Manager', 'Designer',
  'Teacher', 'Engineer', 'Doctor', 'Nurse', 'Lawyer', 'Accountant',
  'Chef', 'Architect', 'Musician', 'Artist', 'Writer', 'Journalist',
  'Scientist', 'Business Analyst', 'Marketing Specialist', 'Sales Manager',
  'Consultant', 'Entrepreneur', 'Social Worker', 'Civil Servant'
];

const educationLevels = [
  'High School Diploma', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree',
  'Doctorate', 'Certificate', 'Diploma', 'Postdoctoral Research', 'Trade School'
];

const interests = [
  'Music', 'Dance', 'Cinema', 'Traveling', 'Hiking', 'Photography', 'Cooking', 'Baking',
  'Reading', 'Writing', 'Blogging', 'Vlogging', 'Gaming', 'Fitness', 'Yoga', 'Meditation',
  'Cycling', 'Running', 'Swimming', 'Tennis', 'Basketball', 'Football', 'Baseball', 'Golf',
  'Fishing', 'Camping', 'Surfing', 'Skiing', 'Snowboarding', 'Rock Climbing', 'Martial Arts',
  'Chess', 'Board Games', 'Card Games', 'Puzzles', 'Art', 'Drawing', 'Painting', 'Sculpting',
  'Crafting', 'Knitting', 'Sewing', 'Gardening', 'Home Improvement', 'DIY Projects', 'Collecting',
  'Antiques', 'Coins', 'Stamps', 'Comics', 'Books', 'Vinyl Records', 'Movies', 'Anime', 'Manga',
  'Photography', 'Videography', 'Filmmaking', 'Acting', 'Theater', 'Musicals', 'Concerts',
  'Live Music', 'Karaoke', 'Pub', 'Clubbing', 'Dancing', 'Shopping', 'Fashion', 'Jewelry',
  'Makeup', 'Skincare', 'Hair Styling', 'Traveling Abroad', 'Road Trips', 'Cruises', 'Camping',
  'Picnics', 'Outdoor Adventures', 'Nature Walks', 'Bird Watching', 'Astronomy', 'Science Fiction',
  'Fantasy', 'History', 'Museums', 'Exhibitions', 'Volunteering', 'Charity Work', 'Animal Rights',
  'Environmentalism', 'Technology', 'Gadgets', 'Programming', 'Web Development', 'Social Media',
  'Podcasting', 'Public Speaking', 'Networking', 'Entrepreneurship', 'Investing',
  'Romantic Movies', 'Romantic Dinners', 'Romantic Getaways', 'Romantic Walks', 'Romantic Music',
  'Romantic Poetry', 'Romantic Novels', 'Romantic Gestures', 'Romantic Picnics', 'Romantic Cruises',
  'Semi-Romantic Movies', 'Semi-Romantic Dinners', 'Semi-Romantic Getaways', 'Semi-Romantic Walks',
  'Semi-Romantic Music', 'Semi-Romantic Poetry', 'Semi-Romantic Novels', 'Semi-Romantic Gestures',
  'Semi-Romantic Picnics', 'Semi-Romantic Cruises', 'Normal'
];

const insertData = async () => {
  try {
    // Insert Genders
    for (const gender of genders) {
      await Gender.findOrCreate({ where: { gender } });
    }

    // Insert EyeColors
    for (const color of eyeColors) {
      await EyeColor.findOrCreate({ where: { eyeColor: color } });
    }

    // Insert HairColors
    for (const color of hairColors) {
      await HairColor.findOrCreate({ where: { hairColor: color } });
    }

    // Insert Professions
    for (const profession of professions) {
      await Profession.findOrCreate({ where: { profession } });
    }

    // Insert Education Levels
    for (const education of educationLevels) {
      await Education.findOrCreate({ where: { education } });
    }
    for (const intrest of interests) {
      await Interest.findOrCreate({ where: { intrest } });
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

// Export the function to be used in index.ts
export default insertData;
