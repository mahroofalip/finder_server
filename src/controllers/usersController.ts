import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { Op } from 'sequelize';
import Like from '../models/Like';
import IgnoredUser from '../models/IgnoredUser';
import BlockedUsers from '../models/BlockedUsers';
import { deleteImages, uploadImages } from '../utils/uploadfiles3';
import { updateUserActivity } from '../utils/AutoInactive';
import Room from '../models/Rooms';

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

export const getKizzoraUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
      if (!req.user) {
          throw new Error('User not authenticated');
      }
      const userId = req.user.id;

      // Step 1: Fetch all ignored profile IDs in one query
      const ignoredProfiles = await IgnoredUser.findAll({
          where: {
              userId: userId
          },
          attributes: ['profileId']
      });
      const ignoredProfileIds = ignoredProfiles.map(profile => profile.profileId);

      // Step 2: Fetch all blocked profiles (that the user has blocked)
      const blockedProfiles = await BlockedUsers.findAll({
          where: {
              userId: userId, // Only profiles that this user has blocked
          },
          attributes: ['profileId']
      });
      const blockedProfileIds = blockedProfiles.map(profile => profile.profileId);

      // Step 3: Fetch all rooms where the current user is either sender or receiver
      const rooms = await Room.findAll({
          where: {
              [Op.or]: [
                  { senderId: userId },
                  { receiverId: userId }
              ]
          },
          attributes: ['senderId', 'receiverId']
      });

      // Get a list of user IDs from rooms (those connected to the current user)
      const roomUserIds = rooms.reduce((acc, room) => {
          acc.push(room.senderId, room.receiverId);
          return acc;
      }, [] as number[]);

      // Step 4: Fetch all users excluding ignored, blocked profiles, and users connected via a room
      const users = await User.findAll({
          where: {
              id: {
                  [Op.and]: [
                      { [Op.notIn]: ignoredProfileIds },
                      { [Op.notIn]: blockedProfileIds },
                      { [Op.notIn]: roomUserIds }  // Exclude users connected via a room
                  ]
              }
          },
          order: [['id', 'DESC']], // 'DESC' for descending order
      });

      // Step 5: Fetch all liked profile IDs in one query
      const likedProfiles = await Like.findAll({
          where: {
              userId: userId,
              profileId: {
                  [Op.in]: users.map(user => user.id)
              }
          },
          attributes: ['profileId']
      });
      const likedProfileIds = likedProfiles.map(profile => profile.profileId);

      // Step 6: Exclude users who have blocked the current user or who are blocked by the current user
      const blockedByUser = await BlockedUsers.findAll({
          where: {
              profileId: userId
          },
          attributes: ['userId']
      });
      const blockedByUserIds = blockedByUser.map(profile => profile.userId);

      const filteredUsers = users.filter(user => 
          !blockedByUserIds.includes(user.id) // Exclude users who have blocked the current user
      );

      // Step 7: Add `isLiked` field and sort users
      const usersWithLikes = filteredUsers.map(user => ({
          ...user.toJSON(),
          isLiked: likedProfileIds.includes(user.id)
      }));

      // Sort users so that liked profiles are at the end of the list
      const sortedUsers = usersWithLikes.sort((a, b) => {
          if (a.isLiked === b.isLiked) return 0;
          return a.isLiked ? 1 : -1;
      });

      res.status(200).json(sortedUsers);
  } catch (error) {
      next(error);
  }
};




export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        const user = await User.findOne({ where: { id: req.user?.id } });

        res.status(200).json({
            status: 'success',
            user,
            message: "User Profile Successfully Fetched",
        });

    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { profileId } = req.params; 
        const userProfile = await User.findByPk(profileId); 

        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found' });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        next(error);
    }
};



export const updateUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }

        const userId = req.user.id;
        const {
            eyeColor,
            hairColor,
            education,
            gender,
            profession,
            displayName,
            firstName,
            lastName,
            maritalStatus,
            dob,
            profileImage, // Base64 string if provided
            userName,
            height,
            weight,
            profileImageKey, // Existing profile image key
            profileExt,
            place,
            interests,
            description,
            lookingFor
        } = req.body;
        let placeDis = place?.description; // Safe access in case `place` is undefined

        const interestsString = Array.isArray(interests) && interests.length > 0
            ? interests.join(',')
            : '';

            const lookingForString = Array.isArray(lookingFor) && lookingFor.length > 0
            ? lookingFor.join(',')
            : '';   

        let profileImageUrl = '';
        let profileImageNewKey = profileImageKey; // Default to existing key

        // Check if the profileImage is a base64 string
        const isBase64 = (str: string) => {
            return /^data:image\/[a-zA-Z]+;base64,/.test(str);
        };

        // Check if the profileImage is an S3 URL
        const isS3Url = (str: string) => {
            return str.startsWith(`${process.env.START_PIC_NAME}`);
        };

        if (profileImage && isBase64(profileImage)) {
            // If a new valid base64 profile image is provided, delete the old one first
            if (profileImageKey) {
                await deleteImages(profileImageKey); // Delete old profile image
            }

            // Upload the new profile image
            const data = await uploadImages(profileImage, "profiles", profileExt);
            profileImageUrl = data.img_url;
            profileImageNewKey = data.img_key;
        } else if (profileImage && isS3Url(profileImage)) {
            // If the profile image is an S3 URL, retain the existing image URL and key
            profileImageUrl = profileImage;
            profileImageNewKey = profileImageKey;
        } else {
            // Retain the old image URL if no new valid base64 image is provided
            const existingUser = await User.findByPk(userId);
            if (existingUser) {
                profileImageUrl = existingUser.profileImage || '';
            }
        }
        
    
        const updatedUser = await User.update(
            {
                firstName,
                lastName,
                maritalStatus,
                profileImage: profileImageUrl, // Use the new URL or the existing one
                profileImageKey: profileImageNewKey, // Use the new key or the existing one
                description,
                userName,
                height,
                weight,
                eyeColor,
                hairColor,
                education,
                gender,
                profession,
                displayName,
                place: placeDis,
                birthDate: dob,
                interests: interestsString,
                lookingFor:lookingForString,
                isProfileCompleted:true
            },
            {
                where: { id: userId },
                returning: true,
            }
        );

        if (updatedUser[0] === 0) {
            return res.status(404).json({ message: 'User not found or no changes made' });
        }

        res.status(200).json({
            status: 'success',
            user: updatedUser[1][0],
            message: "User Profile Successfully Updated",
        });

    } catch (error) {
        next(error);    
    }
};




export const UpdateActiveInactive = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await updateUserActivity(req.user?.id, true);
        res.status(200).json({ message: 'User activity updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user activity' });
    }
};

