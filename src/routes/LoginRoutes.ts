import { Router } from 'express';
import LoginController  from '../controller/LoginController';

const router = Router();


/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Realiza o login com o Azure AD
 *     description: Recebe um `access_token` do Azure AD e gera um JWT para autenticação na API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               access_token:
 *                 type: string
 *                 description: Token de acesso fornecido pelo Azure AD.
 *     responses:
 *       200:
 *         description: Login bem-sucedido, JWT gerado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Autenticado com sucesso!"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Erro de autenticação, token inválido ou expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro de autenticação"
 *                 error:
 *                   type: string
 *                   example: "Token inválido ou expirado"
 */

router.post('/login', LoginController.login);

export default router;
