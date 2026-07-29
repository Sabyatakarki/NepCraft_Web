import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config';
import jwt from 'jsonwebtoken';
import { IUser } from '../model/user.model';
import { UserRepository } from '../repository/user.repository';
import { HttpError } from '../errors/http-error';

declare global {
    namespace Express {
        interface Request {
            user?: Record<string, any> | IUser
        }
    }
} 
let userRepository = new UserRepository();
export const authorizedMiddleware =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let token: string | undefined;
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1]; 
            } else if (req.body && req.body.token) {
                
                token = req.body.token;
            }
            if (!token) throw new HttpError(401, 'Unauthorized JWT missing');
            const decodedToken = jwt.verify(token, JWT_SECRET) as Record<string, any>;
            if (!decodedToken || !decodedToken.id) {
                throw new HttpError(401, 'Unauthorized JWT unverified');
            } 
            const user = await userRepository.getUserById(decodedToken.id);
            if (!user) throw new HttpError(401, 'Unauthorized user not found');
            req.user = {
  ...user.toObject(),
  _id: user._id.toString()
};
 
            next();
        } catch (err: Error | any) {
            return res.status(err.statusCode || 500).json(
                { success: false, message: err.message }
            )
        }
    }

