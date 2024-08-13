
import { v4 as uuidv4 } from 'uuid';
export const generateUniqueUsername = async (): Promise<string> => {
  const uniqueId = uuidv4().replace(/-/g, '');
    return uniqueId.toUpperCase();
};
