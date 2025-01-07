import { Request, Response } from 'express';
import authService from '../service/AuthService';

const login = async (req: Request, res: Response): Promise<void> => {
    const { access_token } = req.body;

    try {
        const user = await authService.authenticateWithMicrosoft(access_token);
        const token = authService.generateJWT(user);
        res.json({ message: 'Autenticado com sucesso!', token });
    } catch (error:any) {
        res.status(401).json({ message: 'Erro de autenticação', error: error.message });
    }
};

export default {
    login,
};
