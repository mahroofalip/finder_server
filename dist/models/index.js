"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncEducation = syncEducation;
exports.syncEyeColor = syncEyeColor;
exports.syncGender = syncGender;
exports.syncHairColor = syncHairColor;
exports.syncInterest = syncInterest;
exports.syncMessage = syncMessage;
exports.syncProfession = syncProfession;
exports.syncRoom = syncRoom;
exports.syncUser = syncUser;
exports.syncUsersPosts = syncUsersPosts;
exports.syncVisitors = syncVisitors;
exports.syncBlockedUsers = syncBlockedUsers;
exports.syncIgnoredUser = syncIgnoredUser;
exports.syncLike = syncLike;
exports.syncSidebarMenu = syncSidebarMenu;
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
async function syncEyeColor() {
    await EyeColor_1.default.sync();
}
async function syncGender() {
    await Gender_1.default.sync();
}
async function syncHairColor() {
    await HairColor_1.default.sync();
}
async function syncInterest() {
    await Interest_1.default.sync();
}
async function syncMessage() {
    await Message_1.default.sync();
}
async function syncProfession() {
    await Profession_1.default.sync();
}
async function syncRoom() {
    await Rooms_1.default.sync();
}
async function syncUser() {
    await User_1.default.sync();
}
async function syncUsersPosts() {
    await UserPosts_1.default.sync();
}
async function syncVisitors() {
    await Visitors_1.default.sync();
}
async function syncBlockedUsers() {
    await BlockedUsers_1.default.sync();
}
async function syncIgnoredUser() {
    await IgnoredUser_1.default.sync();
}
async function syncLike() {
    await Like_1.default.sync();
}
async function syncSidebarMenu() {
    await SideMenu_1.default.sync();
}
