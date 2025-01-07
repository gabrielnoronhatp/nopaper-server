import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '../types/DecodedToken';

const SECRET_KEY = process.env.SECRET_KEY!;  


const verifyJWT = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
        req.user = decoded;  
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido ou expirado' });
    }
};

export default verifyJWT;
