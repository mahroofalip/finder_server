
import { Request, Response, NextFunction } from 'express';
import BlockedUsers from '../models/BlockedUsers';
import User from '../models/User';
import Like from '../models/Like';
import Message from '../models/Message';
import Room from '../models/Rooms';
import { notifyAsBlocked } from '../sockets/socket';

interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

export const blockUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { profileId, roomId } = req.body;
    const userId = req?.user?.id;

    if (!userId || !profileId || !roomId) {
        return res.status(400).json({ message: 'UserId, ProfileId, and RoomId are required' });
    }

    try {
        // Check if the user has already blocked this profile
        const existingBlockedUser = await BlockedUsers.findOne({ where: { userId, profileId } });

        if (existingBlockedUser) {
            // Delete all messages in the room
            await Message.destroy({ where: { room_id: roomId } });
            // Delete the room itself
            await Room.destroy({ where: { id: roomId } });
            return res.status(201).json({ message: 'You already blocked this profile' });
        }

        // Delete all messages in the room
        await Message.destroy({ where: { room_id: roomId } });
        // Delete the room itself
        await Room.destroy({ where: { id: roomId } });

        // Create a new block entry
        const blockedUser = await BlockedUsers.create({ userId, profileId });

        // Fetch the user's first and last name
        const user = await User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Pass the first and last name to the notify function
        const userFullName = `${user.firstName} ${user.lastName}`;
        const message = `${userFullName} has blocked you.`;
        const blockedUserId = profileId; // ID of the user being blocked
        notifyAsBlocked(userId,blockedUserId, message);
        
        res.status(201).json();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const unblockUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Access profileId correctly from req.body
    const { profileId } = req.body.profileId ? req.body.profileId : req.body;
    const userId = req?.user?.id;  // Ensure userId is a number

    // Log to verify values

    if (!userId || typeof profileId !== 'number') {
        return res.status(400).json({ message: 'UserId and ProfileId are required and should be valid numbers' });
    }

    try {
        // Find the block entry
        const blockedUser = await BlockedUsers.findOne({ where: { userId, profileId } });

        if (!blockedUser) {
            // If the block entry does not exist, return a response
            return res.status(404).json({ message: 'Block entry not found' });
        }

        // Remove the block entry
        await blockedUser.destroy();
        res.status(200).json({ message: 'Profile unblocked successfully' });
    } catch (error) {
        console.error('Error in unblockUserProfile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const getBlockedProfiles = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        // Step 1: Fetch all blocked profiles for the current user with profile details
        const blockedProfiles = await BlockedUsers.findAll({
            where: { userId },
            include: [{ model: User, as: 'profile' }]
        });

        // Step 2: Map through blocked profiles and add `isLiked` field
        const blockedProfilesWithLikes = await Promise.all(blockedProfiles.map(async (blockedUser) => {
            // Check if the current user has liked this blocked profile
            const isLiked = await Like.findOne({
                where: {
                    userId: userId,
                    profileId: blockedUser.profile?.id
                }
            });

            return {
                ...blockedUser.profile?.toJSON(), // Convert profile to JSON
                isLiked: !!isLiked // `isLiked` will be true if a Like exists, otherwise false
            };
        }));

        // Respond with the list of blocked profiles including their `isLiked` status
        res.status(200).json(blockedProfilesWithLikes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};