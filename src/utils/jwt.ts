import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'Finder@123';

export const generateToken = (id: number, expiresIn: string = '1d'): string => {
  return jwt.sign({ id }, secret, {
    expiresIn, // Use the passed expiration time
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret);
};
