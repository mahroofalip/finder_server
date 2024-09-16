import { Request, Response, NextFunction } from 'express';
import SidebarMenu from '../models/SideMenu'; // Adjust import path as necessary

interface AuthenticatedRequest extends Request {
    user?: { id: number }; // Assuming the user ID is stored here
}

export const getAllSidebarMenuItems = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const menuItems = await SidebarMenu.findAll({
            where: { isEnabled: true },  // Only return items where isEnabled is true
            order: [['id', 'ASC']], // Optional: Order by ID or any other field
        });

        res.status(200).json(menuItems);
    } catch (error) {
        console.error('Error fetching sidebar menu items:', error);
        next(error);
    }
};
