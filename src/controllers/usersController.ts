
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import EyeColor from '../models/EyeColor';
// import { S3 } from 'aws-sdk';

import { generateUniqueUsername } from '../utils/usernameGenerator';
import { deleteImages, uploadImages } from '../utils/uploadfiles3';
import { updateUserActivity } from '../utils/AutoInactive';

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}



export const getFinderUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        if (!req.user) {
            throw new Error('User not authenticated');
        }
        const userId = req.user.id;
        const users = await User.findAll({
            order: [['id', 'DESC']] // 'DESC' for descending order
        });

        res.status(200).send(users);
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
            return str.startsWith("https://finders3bucket.s3.ap-south-1.amazonaws.com");
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
                lookingFor:lookingForString
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
        updateUserActivity(req.user?.id, true);
        res.status(200).json({ message: 'User activity updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user activity' });
    }
};

