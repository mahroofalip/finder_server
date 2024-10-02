"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSidebarMenu = exports.syncLike = exports.syncIgnoredUser = exports.syncBlockedUsers = exports.syncVisitors = exports.syncUsersPosts = exports.syncUser = exports.syncRoom = exports.syncProfession = exports.syncMessage = exports.syncInterest = exports.syncHairColor = exports.syncGender = exports.syncEyeColor = exports.syncEducation = void 0;
const Education_1 = __importDefault(require("./Education"));
const EyeColor_1 = __importDefault(require("./EyeColor"));
const Gender_1 = __importDefault(require("./Gender"));
const HairColor_1 = __importDefault(require("./HairColor"));
const Interest_1 = __importDefault(require("./Interest"));
const Message_1 = __importDefault(require("./Message"));
const Profession_1 = __importDefault(require("./Profession"));
const Rooms_1 = __importDefault(require("./Rooms"));
const User_1 = __importDefault(require("./User"));
const UserPosts_1 = __importDefault(require("./UserPosts"));
const Visitors_1 = __importDefault(require("./Visitors"));
const BlockedUsers_1 = __importDefault(require("./BlockedUsers"));
const IgnoredUser_1 = __importDefault(require("./IgnoredUser"));
const Like_1 = __importDefault(require("./Like"));
const SideMenu_1 = __importDefault(require("./SideMenu"));
async function syncEducation() {
    await Education_1.default.sync();
}
exports.syncEducation = syncEducation;
async function syncEyeColor() {
    await EyeColor_1.default.sync();
}
exports.syncEyeColor = syncEyeColor;
async function syncGender() {
    await Gender_1.default.sync();
}
exports.syncGender = syncGender;
async function syncHairColor() {
    await HairColor_1.default.sync();
}
exports.syncHairColor = syncHairColor;
async function syncInterest() {
    await Interest_1.default.sync();
}
exports.syncInterest = syncInterest;
async function syncMessage() {
    await Message_1.default.sync();
}
exports.syncMessage = syncMessage;
async function syncProfession() {
    await Profession_1.default.sync();
}
exports.syncProfession = syncProfession;
async function syncRoom() {
    await Rooms_1.default.sync();
}
exports.syncRoom = syncRoom;
async function syncUser() {
    await User_1.default.sync();
}
exports.syncUser = syncUser;
async function syncUsersPosts() {
    await UserPosts_1.default.sync();
}
exports.syncUsersPosts = syncUsersPosts;
async function syncVisitors() {
    await Visitors_1.default.sync();
}
exports.syncVisitors = syncVisitors;
async function syncBlockedUsers() {
    await BlockedUsers_1.default.sync();
}
exports.syncBlockedUsers = syncBlockedUsers;
async function syncIgnoredUser() {
    await IgnoredUser_1.default.sync();
}
exports.syncIgnoredUser = syncIgnoredUser;
async function syncLike() {
    await Like_1.default.sync();
}
exports.syncLike = syncLike;
async function syncSidebarMenu() {
    await SideMenu_1.default.sync();
}
exports.syncSidebarMenu = syncSidebarMenu;
