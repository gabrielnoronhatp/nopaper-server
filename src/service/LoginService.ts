import { pgPool } from '../config/database';
import { LoginData } from '../types/LoginData';


export class LoginService {
  static async authenticate(loginData: LoginData): Promise<any> {
    try {
      const query = `
        SELECT
          UPPER(nome) AS nome,
          password,
          password = crypt($1, password) AS boolean_
        FROM intra.op_logins
        WHERE UPPER(nome) = $2
        AND password = crypt($1, password)
      `;
      
      const result = await pgPool.query(query, [loginData.password, loginData.username]);

      if (result.rows.length === 0) {
        return { success: false, message: 'Usuário ou senha incorretos' };
      }

      const user = result.rows[0];
      
      if (user.boolean_) {
        return { success: true, message: 'Login bem-sucedido', user: user };
      } else {
        return { success: false, message: 'Senha incorreta' };
      }
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      throw new Error('Erro ao autenticar usuário');
    }
  }
}
