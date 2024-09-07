import Education from "./Education";
import EyeColor from "./EyeColor";
import Gender from "./Gender";
import HairColor from "./HairColor";
import Interest from "./Interest";
import Message from "./Message";
import Profession from "./Profession";
import Room from "./Rooms";
import User from "./User";
import UsersPosts from "./UserPosts";
import Visitors from "./Visitors";
import BlockedUsers from "./BlockedUsers";
import IgnoredUser from "./IgnoredUser";
import Like from "./Like";
import SidebarMenu from "./SideMenu";

export async function syncEducation() {
  await Education.sync();
}

export async function syncEyeColor() {
  await EyeColor.sync();
}

export async function syncGender() {
  await Gender.sync();
}

export async function syncHairColor() {
  await HairColor.sync();
}

export async function syncInterest() {
  await Interest.sync();
}

export async function syncMessage() {
  await Message.sync();
}

export async function syncProfession() {
  await Profession.sync();
}

export async function syncRoom() {
  await Room.sync();
}

export async function syncUser() {
  await User.sync();
}

export async function syncUsersPosts() {
  await UsersPosts.sync();
}

export async function syncVisitors() {
  await Visitors.sync();
}

export async function syncBlockedUsers() {
  await BlockedUsers.sync();
}

export async function syncIgnoredUser() {
  await IgnoredUser.sync();
}

export async function syncLike() {
  await Like.sync();
}


export async function syncSidebarMenu() {
  await SidebarMenu.sync();
}
