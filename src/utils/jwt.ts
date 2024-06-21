import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (id: number): string => {
  return jwt.sign({ id }, secret, {
    expiresIn: '1d', // 1 day
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret);
};
