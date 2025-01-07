import axios from 'axios';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY!;  


interface User {
    id: string;
    displayName: string;
    mail: string;
}

const authenticateWithMicrosoft = async (access_token: string): Promise<User> => {
    try {
        const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return response.data;
    } catch (error) {
        throw new Error('Token inválido ou expirado');
    }
};

const generateJWT = (user: User): string => {
    const payload = {
        id: user.id,
        email: user.mail,
        name: user.displayName,
    };

    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

export default {
    authenticateWithMicrosoft,
    generateJWT,
};
