"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Gender_1 = __importDefault(require("./models/Gender"));
const EyeColor_1 = __importDefault(require("./models/EyeColor"));
const HairColor_1 = __importDefault(require("./models/HairColor"));
const Profession_1 = __importDefault(require("./models/Profession"));
const Education_1 = __importDefault(require("./models/Education"));
const Interest_1 = __importDefault(require("./models/Interest"));
const SideMenu_1 = __importDefault(require("./models/SideMenu"));
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
const sidebarMenuItems = [
    { label: 'Posts', icon: 'HomeIcon', isEnabled: false },
    { label: 'Profile', icon: 'PersonIcon', isEnabled: true },
    { label: 'Matches', icon: 'FavoriteBorderIcon', isEnabled: true },
    { label: 'Search', icon: 'SearchOutlinedIcon', isEnabled: false },
    { label: 'Visitors', icon: 'RemoveRedEyeIcon', isEnabled: true },
    { label: 'Likes', icon: 'FavoriteBorderIcon', isEnabled: true },
    { label: 'Messages', icon: 'MessageIcon', isEnabled: true },
    { label: 'Skipped', icon: 'ThumbDownOffAltIcon', isEnabled: true },
    { label: 'Blocked', icon: 'BlockOutlinedIcon', isEnabled: true },
    { label: 'Logout', icon: 'LoginIcon', isEnabled: true },
];
const insertData = async () => {
    try {
        // Insert Genders
        for (const gender of genders) {
            await Gender_1.default.findOrCreate({ where: { gender } });
        }
        // Insert EyeColors
        for (const color of eyeColors) {
            await EyeColor_1.default.findOrCreate({ where: { eyeColor: color } });
        }
        // Insert HairColors
        for (const color of hairColors) {
            await HairColor_1.default.findOrCreate({ where: { hairColor: color } });
        }
        // Insert Professions
        for (const profession of professions) {
            await Profession_1.default.findOrCreate({ where: { profession } });
        }
        // Insert Education Levels
        for (const education of educationLevels) {
            await Education_1.default.findOrCreate({ where: { education } });
        }
        for (const intrest of interests) {
            await Interest_1.default.findOrCreate({ where: { intrest } });
        }
        for (const item of sidebarMenuItems) {
            await SideMenu_1.default.findOrCreate({
                where: { label: item.label },
                defaults: { label: item.label, icon: item.icon, isEnabled: item.isEnabled }
            });
        }
    }
    catch (error) {
        console.error('Error inserting data:', error);
    }
};
// Export the function to be used in index.ts
exports.default = insertData;
